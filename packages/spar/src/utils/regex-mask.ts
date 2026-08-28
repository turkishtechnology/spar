/**
 * L3 — incremental regex matching for input masks.
 *
 * A regex such as `/^[A-Z]{2}[0-9]{4}$/` describes the *final* value, not the
 * intermediate states a user types through. Validating partial input against a
 * full-match regex is impossible with the native `RegExp` engine: `'A'` and `'1'`
 * both fail `^[A-Z]{2}[0-9]{4}$`, but only `'1'` should be rejected.
 *
 * This module compiles the pattern into a small Thompson NFA and simulates it one
 * character at a time, so it can tell whether the value so far is a complete
 * match ({@link DONE}), a valid prefix that could still grow ({@link MORE}), or
 * impossible ({@link FAILED}).
 *
 * Supported syntax: literals, `.`, escapes (`\d \D \w \W \s \S` and literal
 * escapes), character classes `[...]` / `[^...]` with ranges, groups `(...)`,
 * `(?:...)` and `(?<name>...)`, alternation `|`, quantifiers `* + ? {n} {n,}
 * {n,m}`, and anchors `^ $`.
 *
 * Lookarounds and back-references cannot be modelled by a finite automaton.
 * Patterns using them — and any pattern the native `RegExp` rejects — compile to
 * a failure carrying the reason, and the caller degrades to pass-through rather
 * than locking the user out of the field.
 *
 * Ported from `takeoff-ui/packages/core/src/utils/regex-mask-utils.ts`. The one
 * behavioural change: the original discarded the failure reason in
 * `catch { return null }`, leaving a consumer with a silently inert mask. Here the
 * reason survives so `useMask` can warn in development.
 */

/** The value is a complete match for the pattern. */
export const DONE = 'DONE';
/** The value is a valid prefix; more characters could complete it. */
export const MORE = 'MORE';
/** The value can never match the pattern, no matter what is appended. */
export const FAILED = 'FAILED';

export type MatchState = typeof DONE | typeof MORE | typeof FAILED;

/** Classifies a value against a compiled pattern. */
export type IncrementalMatcher = (value: string) => MatchState;

/** Outcome of {@link createIncrementalMatcher}. */
export type MatcherCompileResult =
  | { ok: true; matcher: IncrementalMatcher }
  | { ok: false; reason: string };

type CharTest = (char: string) => boolean;

/**
 * Thrown when the pattern uses constructs a finite automaton cannot model
 * (lookarounds, back-references).
 */
class UnsupportedRegexError extends Error {}

interface CharNode {
  type: 'char';
  match: CharTest;
}
interface AnchorNode {
  type: 'anchor';
}
interface SeqNode {
  type: 'seq';
  items: AstNode[];
}
interface AltNode {
  type: 'alt';
  opts: AstNode[];
}
interface RepNode {
  type: 'rep';
  node: AstNode;
  min: number;
  max: number;
}
interface OptNode {
  type: 'opt';
  node: AstNode;
}
interface StarNode {
  type: 'star';
  node: AstNode;
}
type AstNode = CharNode | AnchorNode | SeqNode | AltNode | RepNode | OptNode | StarNode;

interface NfaState {
  eps: NfaState[];
  cons: CharTest | null;
  to: NfaState | null;
  accept: boolean;
}

/** Upper bound on bounded quantifiers (`{n,m}`); guards against state explosion. */
const MAX_QUANTIFIER = 1000;

// ── Parser: regex source → AST ──────────────────────────────────────────────

const parse = (src: string): AstNode => {
  let i = 0;
  /** Returns '' past the end of the source, which matches no regex construct. */
  const peek = (): string => src[i] ?? '';
  const next = (): string => src[i++] ?? '';
  const eof = () => i >= src.length;

  const parseAlt = (): AstNode => {
    const opts: AstNode[] = [parseSeq()];
    while (peek() === '|') {
      next();
      opts.push(parseSeq());
    }
    const [only] = opts;
    return opts.length === 1 && only ? only : { type: 'alt', opts };
  };

  const parseSeq = (): AstNode => {
    const items: AstNode[] = [];
    while (!eof() && peek() !== '|' && peek() !== ')') {
      items.push(parseQuant());
    }
    return { type: 'seq', items };
  };

  /** Lazy quantifiers match the same language, so the modifier is consumed and ignored. */
  const lazy = () => {
    if (peek() === '?') next();
  };

  const parseQuant = (): AstNode => {
    const node = parseAtom();
    const char = peek();

    if (char === '*') {
      next();
      lazy();
      return { type: 'rep', node, min: 0, max: Infinity };
    }
    if (char === '+') {
      next();
      lazy();
      return { type: 'rep', node, min: 1, max: Infinity };
    }
    if (char === '?') {
      next();
      lazy();
      return { type: 'rep', node, min: 0, max: 1 };
    }
    if (char === '{') {
      const save = i;
      const bounds = src.slice(i).match(/^\{(\d*)(?:,(\d*))?\}/);
      if (bounds) {
        i += bounds[0].length;
        lazy();
        const min = bounds[1] === '' ? 0 : Number(bounds[1]);
        const max =
          bounds[2] === undefined
            ? bounds[1] === ''
              ? Infinity
              : min
            : bounds[2] === ''
              ? Infinity
              : Number(bounds[2]);
        return { type: 'rep', node, min, max };
      }
      // Not a quantifier; '{' is a literal, handled by parseAtom on the next pass.
      i = save;
    }

    return node;
  };

  const parseEsc = (escaped: string): CharNode => {
    // Back-references require memory of captured text; an NFA has none.
    if (escaped >= '1' && escaped <= '9') {
      throw new UnsupportedRegexError('back-reference is not supported');
    }
    if (escaped === 'k') {
      throw new UnsupportedRegexError('named back-reference is not supported');
    }

    const classes: Record<string, CharTest> = {
      d: (char) => char >= '0' && char <= '9',
      D: (char) => !(char >= '0' && char <= '9'),
      w: (char) => /[A-Za-z0-9_]/.test(char),
      W: (char) => !/[A-Za-z0-9_]/.test(char),
      s: (char) => /\s/.test(char),
      S: (char) => !/\s/.test(char),
    };
    if (classes[escaped]) return { type: 'char', match: classes[escaped] };

    const literal = ({ n: '\n', t: '\t', r: '\r' } as Record<string, string>)[escaped] ?? escaped;
    return { type: 'char', match: (char) => char === literal };
  };

  const parseClass = (): CharNode => {
    next(); // consume '['
    let negated = false;
    if (peek() === '^') {
      negated = true;
      next();
    }

    const tests: CharTest[] = [];
    while (!eof() && peek() !== ']') {
      let char = next();

      if (char === '\\') {
        const escaped = next();
        const classes: Record<string, CharTest> = {
          d: (candidate) => candidate >= '0' && candidate <= '9',
          w: (candidate) => /[A-Za-z0-9_]/.test(candidate),
          s: (candidate) => /\s/.test(candidate),
        };
        if (classes[escaped]) {
          tests.push(classes[escaped]);
          continue;
        }
        char = ({ n: '\n', t: '\t', r: '\r' } as Record<string, string>)[escaped] ?? escaped;
      }

      if (peek() === '-' && src[i + 1] !== ']' && i + 1 < src.length) {
        next(); // consume '-'
        const lo = char;
        const hi = next();
        tests.push((candidate) => candidate >= lo && candidate <= hi);
      } else {
        const only = char;
        tests.push((candidate) => candidate === only);
      }
    }
    next(); // consume ']'

    return {
      type: 'char',
      match: (candidate) => {
        const hit = tests.some((test) => test(candidate));
        return negated ? !hit : hit;
      },
    };
  };

  const parseAtom = (): AstNode => {
    const char = peek();

    if (char === '(') {
      next();
      if (peek() === '?') {
        const flag = src[i + 1];
        if (flag === ':') {
          i += 2; // non-capturing group (?:...)
        } else if (flag === '<' && src[i + 2] !== '=' && src[i + 2] !== '!') {
          // Named capturing group (?<name>...) — skip up to and including '>'.
          i += 2;
          while (!eof() && peek() !== '>') next();
          next();
        } else {
          // Lookahead (?= (?! or lookbehind (?<= (?<! — not expressible as an NFA.
          throw new UnsupportedRegexError('lookaround is not supported');
        }
      }
      const inner = parseAlt();
      next(); // consume ')'
      return inner;
    }

    if (char === '[') return parseClass();
    if (char === '^' || char === '$') {
      next();
      return { type: 'anchor' };
    }
    if (char === '.') {
      next();
      return { type: 'char', match: (candidate) => candidate !== '\n' };
    }
    if (char === '\\') {
      next();
      return parseEsc(next());
    }

    next();
    return { type: 'char', match: (candidate) => candidate === char };
  };

  return parseAlt();
};

// ── Normaliser: expand bounded reps into explicit optional chains ───────────

const cloneNode = (node: AstNode): AstNode => {
  switch (node.type) {
    case 'char':
      return { type: 'char', match: node.match };
    case 'anchor':
      return { type: 'anchor' };
    case 'seq':
      return { type: 'seq', items: node.items.map(cloneNode) };
    case 'alt':
      return { type: 'alt', opts: node.opts.map(cloneNode) };
    case 'rep':
      return { type: 'rep', node: cloneNode(node.node), min: node.min, max: node.max };
    case 'opt':
      return { type: 'opt', node: cloneNode(node.node) };
    case 'star':
      return { type: 'star', node: cloneNode(node.node) };
  }
};

const expand = (node: AstNode): AstNode => {
  switch (node.type) {
    case 'seq':
      return { type: 'seq', items: node.items.map(expand) };
    case 'alt':
      return { type: 'alt', opts: node.opts.map(expand) };
    case 'opt':
      return { type: 'opt', node: expand(node.node) };
    case 'star':
      return { type: 'star', node: expand(node.node) };
    case 'rep': {
      const inner = expand(node.node);
      const min = Math.min(node.min, MAX_QUANTIFIER);
      const items: AstNode[] = [];

      for (let k = 0; k < min; k++) items.push(cloneNode(inner));

      if (node.max === Infinity) {
        items.push({ type: 'star', node: cloneNode(inner) });
      } else {
        // (max - min) nested optionals: ( inner ( inner ( ... )? )? )?
        const span = Math.min(node.max, MAX_QUANTIFIER) - min;
        let opt: AstNode | null = null;
        for (let k = 0; k < span; k++) {
          const seqItems: AstNode[] = [cloneNode(inner)];
          if (opt) seqItems.push(opt);
          opt = { type: 'opt', node: { type: 'seq', items: seqItems } };
        }
        if (opt) items.push(opt);
      }

      return { type: 'seq', items };
    }
    default:
      return node;
  }
};

// ── Compiler: AST → Thompson NFA ────────────────────────────────────────────

interface Fragment {
  start: NfaState;
  outs: ((target: NfaState) => void)[];
}

const compile = (ast: AstNode): NfaState => {
  const mk = (): NfaState => ({ eps: [], cons: null, to: null, accept: false });
  const patch = (outs: Fragment['outs'], target: NfaState) => outs.forEach((set) => set(target));

  const build = (node: AstNode): Fragment => {
    switch (node.type) {
      case 'char': {
        const state = mk();
        return {
          start: state,
          outs: [
            (target) => {
              state.cons = node.match;
              state.to = target;
            },
          ],
        };
      }
      case 'anchor': {
        const state = mk();
        return { start: state, outs: [(target) => state.eps.push(target)] };
      }
      case 'seq': {
        const [firstItem, ...restItems] = node.items;
        if (!firstItem) {
          const state = mk();
          return { start: state, outs: [(target) => state.eps.push(target)] };
        }
        let fragment = build(firstItem);
        for (const item of restItems) {
          const nextFragment = build(item);
          patch(fragment.outs, nextFragment.start);
          fragment = { start: fragment.start, outs: nextFragment.outs };
        }
        return fragment;
      }
      case 'alt': {
        const state = mk();
        const outs: Fragment['outs'] = [];
        node.opts.forEach((option) => {
          const fragment = build(option);
          state.eps.push(fragment.start);
          outs.push(...fragment.outs);
        });
        return { start: state, outs };
      }
      case 'opt': {
        const fragment = build(node.node);
        const state = mk();
        state.eps.push(fragment.start);
        return { start: state, outs: [...fragment.outs, (target) => state.eps.push(target)] };
      }
      case 'star': {
        const state = mk();
        const fragment = build(node.node);
        state.eps.push(fragment.start);
        patch(fragment.outs, state);
        return { start: state, outs: [(target) => state.eps.push(target)] };
      }
      case 'rep': {
        // Reps are removed by expand(); compile the equivalent star as a safety net.
        return build({ type: 'star', node: node.node });
      }
    }
  };

  const fragment = build(ast);
  const accept = mk();
  accept.accept = true;
  patch(fragment.outs, accept);
  return fragment.start;
};

// ── Simulation ──────────────────────────────────────────────────────────────

const epsClosure = (states: Iterable<NfaState>): Set<NfaState> => {
  const stack = [...states];
  const seen = new Set<NfaState>(stack);

  while (stack.length) {
    const state = stack.pop()!;
    for (const target of state.eps) {
      if (!seen.has(target)) {
        seen.add(target);
        stack.push(target);
      }
    }
  }

  return seen;
};

const stepStates = (states: Set<NfaState>, char: string): Set<NfaState> => {
  const nextStates = new Set<NfaState>();
  for (const state of states) {
    if (state.cons && state.to && state.cons(char)) nextStates.add(state.to);
  }
  return epsClosure(nextStates);
};

// ── Public surface ──────────────────────────────────────────────────────────

/**
 * Builds a reusable matcher for a pattern.
 *
 * @param source - Regex source string. Anchors `^ $` are accepted and treated as
 *   a single-line, fully-anchored match.
 * @returns Either the matcher, or a failure carrying the reason the pattern could
 *   not be compiled. Callers degrade to pass-through on failure — a regex the
 *   matcher cannot handle must never lock the user out of the field — but should
 *   surface the reason in development rather than fail silently.
 */
export const createIncrementalMatcher = (source: string): MatcherCompileResult => {
  // Let the native engine reject malformed patterns (unterminated classes or
  // groups, invalid escapes, …) so a bad regex is never silently misread.
  try {
    new RegExp(source);
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'invalid regular expression',
    };
  }

  let start: NfaState;
  try {
    start = compile(expand(parse(source)));
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof UnsupportedRegexError
          ? error.message
          : 'pattern could not be analysed for incremental matching',
    };
  }

  const matcher: IncrementalMatcher = (value) => {
    let current = epsClosure([start]);
    for (const char of value) {
      current = stepStates(current, char);
      if (current.size === 0) return FAILED;
    }
    return [...current].some((state) => state.accept) ? DONE : MORE;
  };

  return { ok: true, matcher };
};

/** Strips a leading `^` and a trailing `$`, for use where anchors are implied. */
export const stripAnchors = (source: string): string =>
  source.replace(/^\^/, '').replace(/\$$/, '');
