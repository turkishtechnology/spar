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
 * Supported syntax: literals, `.`, escapes (`\d \D \w \W \s \S`, `\p{…}` /
 * `\P{…}`, `\n \t \r \f \v \0`, `\xNN`, `\uXXXX`, `\u{…}`, `\cX` and
 * punctuation escapes), character classes `[...]` / `[^...]` with ranges, groups
 * `(...)`, `(?:...)` and `(?<name>...)`, alternation `|`, quantifiers `* + ?
 * {n} {n,} {n,m}`, and anchors `^ $`. Flags are honoured: `i` folds literals and
 * ranges, `s` widens `.`, `u` / `v` enable `\p{…}` and `\u{…}`.
 *
 * Lookarounds, back-references and word boundaries cannot be modelled by a
 * finite automaton. Patterns using them — and any pattern the native `RegExp`
 * rejects — compile to a failure carrying the reason, and the caller degrades to
 * pass-through rather than locking the user out of the field. An escape this
 * parser does not model fails the same way: reading it as the escaped letter
 * would build an automaton that silently rejects everything the pattern was
 * written to accept.
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

/**
 * A left-to-right scan that keeps its own position in the automaton.
 *
 * {@link IncrementalMatcher} re-simulates the whole value on every call, so
 * building a value character by character costs O(n²). A scanner carries the
 * state set forward instead, which is what the masking loop needs: one step per
 * character, and a rejected character leaves the state untouched.
 */
export interface MatcherScanner {
  /** Feeds one character. On {@link FAILED} the scanner does not advance. */
  push: (char: string) => MatchState;

  /** The verdict for everything pushed so far. */
  state: () => MatchState;
}

/** Outcome of {@link createIncrementalMatcher}. */
export type MatcherCompileResult =
  | { ok: true; matcher: IncrementalMatcher; scan: () => MatcherScanner }
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
  kind: 'start' | 'end';
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

/**
 * The regex flags that change what a character matches.
 *
 * `g` and `y` track a match position, and `m` only re-points the anchors this
 * matcher already treats as epsilon transitions — none of the three can change
 * a verdict about a whole value, so they are accepted and ignored.
 */
interface ParseFlags {
  /** `i` — literals and ranges match either case. */
  ignoreCase: boolean;
  /** `s` — `.` also matches line terminators. */
  dotAll: boolean;
  /** `u` / `v` — `\u{…}` and `\p{…}` are escapes rather than literal letters. */
  unicode: boolean;
}

/** Escapes that stand for a whole class of characters. */
const CLASS_ESCAPES: Record<string, CharTest> = {
  d: (char) => char >= '0' && char <= '9',
  D: (char) => !(char >= '0' && char <= '9'),
  w: (char) => /^[A-Za-z0-9_]$/u.test(char),
  W: (char) => !/^[A-Za-z0-9_]$/u.test(char),
  s: (char) => /^\s$/u.test(char),
  S: (char) => !/^\s$/u.test(char),
};

/** Escapes that stand for one non-printable character. */
const CONTROL_LITERALS: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  f: '\f',
  v: '\v',
  '0': '\0',
};

/** `.` matches everything except the line terminators, unless `s` is set. */
const LINE_TERMINATOR = /^[\n\r\u2028\u2029]$/u;

/** One resolved escape: either a class test, or the single character it denotes. */
type EscapeResult = { test: CharTest } | { literal: string };

const parse = (src: string, flags: ParseFlags): AstNode => {
  // Indexed by code point rather than code unit: the simulation feeds the
  // matcher one code point at a time, so an astral literal such as `[😀🙂]` has
  // to be parsed as one character or it could never match.
  const chars = [...src];
  let i = 0;
  /** Returns '' past the end of the source, which matches no regex construct. */
  const peek = (): string => chars[i] ?? '';
  const at = (offset: number): string => chars[i + offset] ?? '';
  const next = (): string => chars[i++] ?? '';
  const eof = () => i >= chars.length;

  const codePointOf = (char: string): number => char.codePointAt(0) ?? -1;

  /** A single literal character; folded to both cases under `i`. */
  const literalTest = (literal: string): CharTest =>
    flags.ignoreCase
      ? (char) => char === literal || char.toLowerCase() === literal.toLowerCase()
      : (char) => char === literal;

  /** An inclusive `lo-hi` range, compared by code point so astral bounds work. */
  const rangeTest = (lo: string, hi: string): CharTest => {
    const low = codePointOf(lo);
    const high = codePointOf(hi);
    const inRange = (char: string): boolean => {
      const code = codePointOf(char);
      return code >= low && code <= high;
    };

    return flags.ignoreCase
      ? (char) => inRange(char) || inRange(char.toLowerCase()) || inRange(char.toUpperCase())
      : inRange;
  };

  const readHex = (count: number): string => {
    let hex = '';
    for (let k = 0; k < count; k++) hex += next();
    if (hex.length !== count || !/^[0-9a-fA-F]+$/.test(hex)) {
      throw new UnsupportedRegexError('invalid hexadecimal escape');
    }
    return String.fromCodePoint(Number.parseInt(hex, 16));
  };

  const readUnicodeEscape = (): string => {
    // `\u{…}` is only a code point escape under `u`; without it the braces are
    // a quantifier over a literal `u`, which the native engine reads too.
    if (!flags.unicode || peek() !== '{') return readHex(4);

    next(); // consume '{'
    let hex = '';
    while (!eof() && peek() !== '}') hex += next();
    if (next() !== '}' || !/^[0-9a-fA-F]+$/.test(hex)) {
      throw new UnsupportedRegexError('invalid unicode escape');
    }

    const code = Number.parseInt(hex, 16);
    if (code > 0x10ffff) throw new UnsupportedRegexError('unicode escape out of range');
    return String.fromCodePoint(code);
  };

  const readControlEscape = (): string => {
    const letter = peek();
    if (!/^[A-Za-z]$/.test(letter)) throw new UnsupportedRegexError('invalid control escape');
    next();
    return String.fromCharCode(letter.toUpperCase().charCodeAt(0) - 64);
  };

  /**
   * `\p{…}` / `\P{…}` — delegated to the native engine, which owns the property
   * tables. Only an escape under `u`; otherwise `\p` is the letter `p`.
   */
  const readUnicodeProperty = (negated: boolean): EscapeResult => {
    if (!flags.unicode) return { literal: negated ? 'P' : 'p' };
    if (peek() !== '{') throw new UnsupportedRegexError('\\p must be followed by {…}');

    next(); // consume '{'
    let body = '';
    while (!eof() && peek() !== '}') body += next();
    if (next() !== '}') throw new UnsupportedRegexError('unterminated \\p{…}');

    let property: RegExp;
    try {
      property = new RegExp(`^\\${negated ? 'P' : 'p'}{${body}}$`, flags.ignoreCase ? 'iu' : 'u');
    } catch {
      throw new UnsupportedRegexError(`\\p{${body}} is not a known unicode property`);
    }
    return { test: (char) => property.test(char) };
  };

  /**
   * Resolves the escape sequence after a consumed backslash.
   *
   * Anything this parser does not model throws rather than degrading to the
   * escaped letter: reading `\p{L}` as a literal `p` would compile cleanly and
   * then reject every letter the pattern was written to accept — a silent
   * lockout. Failing here lets the caller pass through and say why instead.
   */
  const readEscape = (): EscapeResult => {
    const escaped = next();
    if (escaped === '') throw new UnsupportedRegexError('trailing backslash');

    // Back-references require memory of captured text; an NFA has none.
    if (escaped >= '1' && escaped <= '9') {
      throw new UnsupportedRegexError('back-reference is not supported');
    }
    if (escaped === 'k') {
      throw new UnsupportedRegexError('named back-reference is not supported');
    }
    // A boundary is a property of the position, not of the character there.
    if (escaped === 'b' || escaped === 'B') {
      throw new UnsupportedRegexError('word boundary is not supported');
    }

    const classTest = CLASS_ESCAPES[escaped];
    if (classTest) return { test: classTest };

    if (escaped === 'p' || escaped === 'P') return readUnicodeProperty(escaped === 'P');
    if (escaped === 'x') return { literal: readHex(2) };
    if (escaped === 'u') return { literal: readUnicodeEscape() };
    if (escaped === 'c') return { literal: readControlEscape() };

    const control = CONTROL_LITERALS[escaped];
    if (control !== undefined) return { literal: control };

    // An alphanumeric escape that is none of the above is a construct this
    // parser does not know. Punctuation escapes (`\.`, `\$`, `\\`, …) are their
    // own literal and are the only ones that fall through.
    if (/^[A-Za-z0-9]$/.test(escaped)) {
      throw new UnsupportedRegexError(`\\${escaped} is not supported`);
    }

    return { literal: escaped };
  };

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
      // A lower bound is required: JS reads `a{}` and `a{,3}` as literal braces,
      // not as quantifiers, so anything without one has to fall through.
      // The bounds are ASCII-only, so their code-unit length is their code-point
      // length and the match can be measured against the code point index.
      const bounds = chars
        .slice(i)
        .join('')
        .match(/^\{(\d+)(?:,(\d*))?\}/);
      if (bounds) {
        i += bounds[0].length;
        lazy();
        const min = Number(bounds[1]);
        const max = bounds[2] === undefined ? min : bounds[2] === '' ? Infinity : Number(bounds[2]);
        return { type: 'rep', node, min, max };
      }
      // Not a quantifier; '{' is a literal, handled by parseAtom on the next pass.
      i = save;
    }

    return node;
  };

  const parseEsc = (): CharNode => {
    const escape = readEscape();
    return {
      type: 'char',
      match: 'test' in escape ? escape.test : literalTest(escape.literal),
    };
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
        const escape = readEscape();
        // `\d`, `\W`, `\p{L}`, … are whole classes, so they join the union as
        // they are — and cannot serve as a range bound.
        if ('test' in escape) {
          tests.push(escape.test);
          continue;
        }
        char = escape.literal;
      }

      if (peek() === '-' && at(1) !== ']' && i + 1 < chars.length) {
        next(); // consume '-'
        let hi = next();
        if (hi === '\\') {
          const escape = readEscape();
          if ('test' in escape) {
            throw new UnsupportedRegexError('character class escape cannot bound a range');
          }
          hi = escape.literal;
        }
        tests.push(rangeTest(char, hi));
      } else {
        tests.push(literalTest(char));
      }
    }
    next(); // consume ']'

    return {
      type: 'char',
      // Negation applies to the union, after each member has been case-folded:
      // folding the result instead would make `[^a-z]` under `i` accept `A`.
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
        const flag = at(1);
        if (flag === ':') {
          i += 2; // non-capturing group (?:...)
        } else if (flag === '<' && at(2) !== '=' && at(2) !== '!') {
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
      return { type: 'anchor', kind: char === '^' ? 'start' : 'end' };
    }
    if (char === '.') {
      next();
      return {
        type: 'char',
        match: flags.dotAll ? () => true : (candidate) => !LINE_TERMINATOR.test(candidate),
      };
    }
    if (char === '\\') {
      next();
      return parseEsc();
    }

    next();
    return { type: 'char', match: literalTest(char) };
  };

  return parseAlt();
};

// ── Validator: anchors have to sit where a whole-value match can satisfy them ─

/**
 * Rejects an anchor that can never be satisfied.
 *
 * The matcher only ever matches a whole value, so `^` is an epsilon exactly
 * where nothing can precede it and `$` exactly where nothing can follow. An
 * anchor anywhere else compiles to an epsilon too, and would then accept what
 * the source regex rejects — `a$b` reporting DONE for `"ab"`.
 *
 * Position is a property of the finished tree, not of the character before it:
 * `$` followed by `)` looks final while parsing, but `(a$)b` still has a `b`
 * after the group. So the flags travel down from the root — a sequence hands
 * `atStart` to its first item and `atEnd` to its last, alternation hands both to
 * every branch, and a quantified subtree can repeat away from either edge and so
 * hands down neither.
 */
const validateAnchors = (node: AstNode, atStart: boolean, atEnd: boolean): void => {
  switch (node.type) {
    case 'anchor':
      if (node.kind === 'start' && !atStart) {
        throw new UnsupportedRegexError('`^` is only supported at the start of a pattern');
      }
      if (node.kind === 'end' && !atEnd) {
        throw new UnsupportedRegexError('`$` is only supported at the end of a pattern');
      }
      return;

    case 'seq':
      node.items.forEach((item, index) =>
        validateAnchors(item, atStart && index === 0, atEnd && index === node.items.length - 1),
      );
      return;

    case 'alt':
      node.opts.forEach((option) => validateAnchors(option, atStart, atEnd));
      return;

    case 'rep': {
      // Exactly one repetition leaves the subtree where it stands; any other
      // bound lets it match away from the edge, where no anchor holds.
      const once = node.min === 1 && node.max === 1;
      validateAnchors(node.node, atStart && once, atEnd && once);
      return;
    }

    case 'opt':
    case 'star':
      validateAnchors(node.node, false, false);
      return;

    case 'char':
      return;
  }
};

// ── Normaliser: expand bounded reps into explicit optional chains ───────────

const cloneNode = (node: AstNode): AstNode => {
  switch (node.type) {
    case 'char':
      return { type: 'char', match: node.match };
    case 'anchor':
      return { type: 'anchor', kind: node.kind };
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
      // Clamping instead would build an automaton for a different language than
      // the one written: `/^\d{1500}$/` would accept exactly 1000 digits, reject
      // the 1001st and report `completed` early — a wrong answer with no reason
      // attached, where every other construct this parser cannot model degrades
      // to pass-through and says why.
      if (node.min > MAX_QUANTIFIER || (node.max !== Infinity && node.max > MAX_QUANTIFIER)) {
        throw new UnsupportedRegexError(
          `quantifier bound above ${MAX_QUANTIFIER} is not supported`,
        );
      }

      const inner = expand(node.node);
      const min = node.min;
      const items: AstNode[] = [];

      for (let k = 0; k < min; k++) items.push(cloneNode(inner));

      if (node.max === Infinity) {
        items.push({ type: 'star', node: cloneNode(inner) });
      } else {
        // (max - min) nested optionals: ( inner ( inner ( ... )? )? )?
        const span = node.max - min;
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
 * @param flags - The `RegExp` flags the pattern was written with. `i`, `s` and
 *   `u` / `v` change what a character matches and are honoured; `g`, `y` and `m`
 *   cannot change the verdict for a whole value and are ignored.
 * @returns Either the matcher, or a failure carrying the reason the pattern could
 *   not be compiled. Callers degrade to pass-through on failure — a regex the
 *   matcher cannot handle must never lock the user out of the field — but should
 *   surface the reason in development rather than fail silently.
 */
export const createIncrementalMatcher = (source: string, flags = ''): MatcherCompileResult => {
  // Let the native engine reject malformed patterns (unterminated classes or
  // groups, invalid escapes, …) so a bad regex is never silently misread.
  try {
    new RegExp(source, flags);
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'invalid regular expression',
    };
  }

  let start: NfaState;
  try {
    const ast = parse(source, {
      ignoreCase: flags.includes('i'),
      dotAll: flags.includes('s'),
      unicode: flags.includes('u') || flags.includes('v'),
    });
    validateAnchors(ast, true, true);
    start = compile(expand(ast));
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof UnsupportedRegexError
          ? error.message
          : 'pattern could not be analysed for incremental matching',
    };
  }

  const verdict = (states: Set<NfaState>): MatchState => {
    if (states.size === 0) return FAILED;
    return [...states].some((state) => state.accept) ? DONE : MORE;
  };

  const scan = (): MatcherScanner => {
    let current = epsClosure([start]);

    return {
      push: (char) => {
        const nextStates = stepStates(current, char);
        if (nextStates.size === 0) return FAILED;
        current = nextStates;
        return verdict(current);
      },
      state: () => verdict(current),
    };
  };

  const matcher: IncrementalMatcher = (value) => {
    const scanner = scan();
    for (const char of value) {
      if (scanner.push(char) === FAILED) return FAILED;
    }
    return scanner.state();
  };

  return { ok: true, matcher, scan };
};

/** Strips a leading `^` and a trailing `$`, for use where anchors are implied. */
export const stripAnchors = (source: string): string => {
  const body = source.startsWith('^') ? source.slice(1) : source;
  if (!body.endsWith('$')) return body;

  // A trailing `$` is an anchor only when it is not itself escaped. `/\d+\$/`
  // ends in a literal dollar sign, and cutting it leaves a dangling backslash
  // that no longer compiles — turning a valid mask into a pass-through.
  let backslashes = 0;
  for (let index = body.length - 2; index >= 0 && body[index] === '\\'; index--) backslashes += 1;

  return backslashes % 2 === 0 ? body.slice(0, -1) : body;
};
