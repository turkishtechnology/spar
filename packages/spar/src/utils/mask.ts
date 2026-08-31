/**
 * The mask engine: L1 shape and L3 incremental regex.
 *
 * Both layers are pure mechanics. `blocks` lays characters into groups and puts
 * delimiters between them; `regex` accepts or rejects a prefix. Neither knows
 * about dates, currencies, phone numbers or any other domain — and there is no
 * third branch that does. `date`, `time` and `number` are sugar for the resolvers
 * in `./mask-date.ts`, `./mask-time.ts` and `./mask-number.ts`, expanded by
 * {@link presetResolver}, so the engine stays domain-free and the built-ins stay
 * on the same public contract as anything userland writes.
 *
 * Pure and dependency-free: every function here is a string transform with no
 * knowledge of DOM, React or caret positions. Caret mapping lives in
 * `./caret.ts`, event handling in `../hooks/useMask.ts`.
 */

import type {
  Mask,
  MaskDateOptions,
  MaskNumberOptions,
  MaskPattern,
  MaskPreset,
  MaskRegexOptions,
  MaskResolver,
  MaskShapeOptions,
  MaskTimeOptions,
} from '@/types';
import {
  applyCase,
  applyCharFilter,
  capacityOf,
  distribute,
  getGapDelimiters,
  stripDelimiters,
} from './mask-shared';
import { createDateMask, dateBlocks } from './mask-date';
import { createNumberMask } from './mask-number';
import { createTimeMask, timeBlocks } from './mask-time';
import {
  DONE,
  FAILED,
  createIncrementalMatcher,
  stripAnchors,
  type MatcherCompileResult,
} from './regex-mask';

/** Outcome of applying an engine pattern to a candidate string. */
export interface MaskResult {
  /** The masked value, delimiters included. */
  value: string;

  /** The masked value with delimiters stripped. */
  raw: string;

  /** Every block filled — or, for L3, the pattern fully matched. */
  completed: boolean;

  /**
   * Set when an L3 pattern could not be compiled. The mask degrades to
   * pass-through; the caller is expected to surface this in development rather
   * than leave the field silently unmasked.
   */
  unsupportedReason?: string;
}

// ── Discriminators ──────────────────────────────────────────────────────────

/** True when the `mask` prop was given as a resolver function. */
export const isMaskResolver = (mask: Mask): mask is MaskResolver => typeof mask === 'function';

/** True for an L3 regex pattern. */
export const isRegexMask = (mask: MaskPattern | MaskPreset): mask is MaskRegexOptions =>
  'regex' in mask;

/** True for the `date` sugar. */
export const isDateMask = (mask: MaskPattern | MaskPreset): mask is MaskDateOptions =>
  'date' in mask;

/** True for the `time` sugar. */
export const isTimeMask = (mask: MaskPattern | MaskPreset): mask is MaskTimeOptions =>
  'time' in mask;

/** True for the `number` sugar. */
export const isNumberMask = (mask: MaskPattern | MaskPreset): mask is MaskNumberOptions =>
  'number' in mask;

// ── Sugar expansion ─────────────────────────────────────────────────────────

/**
 * Expands the `date` / `time` / `number` sugar into the resolver it stands for.
 *
 * Returns `null` for anything already in its final form — a resolver, or a
 * generic engine pattern. `useMask` calls this once per mask run, which is why
 * the factories are deliberately thin: building one allocates a closure and
 * nothing else.
 *
 * @param mask - Any value accepted by the `mask` prop.
 */
export const presetResolver = (mask: Mask): MaskResolver | null => {
  if (isMaskResolver(mask)) return null;
  if (isDateMask(mask)) return createDateMask(mask);
  if (isTimeMask(mask)) return createTimeMask(mask);
  if (isNumberMask(mask)) return createNumberMask(mask);
  return null;
};

/**
 * Block sizes for a pattern. `date` and `time` derive theirs from their tokens,
 * which is why they cannot also accept `blocks`. Regex patterns have none — the
 * pattern is the whole specification — and neither does `number`, whose grouping
 * is variable-width and applied right-to-left.
 */
export const getMaskBlocks = (mask: MaskPattern | MaskPreset): readonly number[] => {
  if (isRegexMask(mask)) return [];
  if (isDateMask(mask)) return dateBlocks(mask.datePattern);
  if (isTimeMask(mask)) return timeBlocks(mask.timePattern);
  if (isNumberMask(mask)) return [];
  return mask.blocks;
};

// ── L1 — shape ──────────────────────────────────────────────────────────────

const maskShape = (input: string, pattern: MaskShapeOptions): MaskResult => {
  const blocks = pattern.blocks;
  const delimiters = getGapDelimiters(pattern, Math.max(0, blocks.length - 1));
  const capacity = capacityOf(blocks);

  const stripped = stripDelimiters(input, delimiters);
  const raw = applyCase(applyCharFilter(stripped, pattern), pattern).slice(0, capacity);

  return {
    value: distribute(raw, blocks, delimiters),
    raw,
    completed: capacity > 0 && raw.length === capacity,
  };
};

// ── L3 — regex ──────────────────────────────────────────────────────────────

/**
 * Compiled matchers, keyed by pattern source and flags.
 *
 * Compilation walks the pattern and builds an NFA, so it must not run per
 * keystroke. The cache also makes the development warning for an unsupported
 * pattern fire once per pattern rather than once per character.
 *
 * Flags are part of the key: `/abc/` and `/abc/i` are different matchers, and
 * keying on the source alone would hand one pattern the other's automaton.
 */
const matcherCache = new Map<string, MatcherCompileResult>();

/** Compiles a pattern source, reusing a previous result when there is one. */
export const getIncrementalMatcher = (source: string, flags = ''): MatcherCompileResult => {
  const key = `${flags}\u0000${source}`;
  const cached = matcherCache.get(key);
  if (cached) return cached;

  const compiled = createIncrementalMatcher(source, flags);
  matcherCache.set(key, compiled);
  return compiled;
};

const maskRegex = (input: string, pattern: MaskRegexOptions): MaskResult => {
  // A `RegExp` carries flags that decide what its own source means — `i` above
  // all. Compiling `regex.source` alone reads the pattern as the author did not
  // write it, and an `/i` pattern silently rejects every character.
  const { regex } = pattern;
  const source = typeof regex === 'string' ? regex : regex.source;
  const flags = typeof regex === 'string' ? '' : regex.flags;
  const compiled = getIncrementalMatcher(stripAnchors(source), flags);
  const cased = applyCase(input, pattern);

  if (!compiled.ok) {
    // Pass-through: an unanalysable pattern must never lock the user out of the
    // field. `completed: true` reports the mask as unconstrained rather than
    // permanently incomplete, so an inert mask cannot block submit logic.
    return { value: cased, raw: cased, completed: true, unsupportedReason: compiled.reason };
  }

  // One pass, one automaton step per character. Re-matching the accepted prefix
  // on every character instead makes a long paste quadratic — and L3 has no
  // block capacity to slice against the way L1 does.
  const scanner = compiled.scan();
  let accepted = '';

  for (const char of cased) {
    if (scanner.push(char) !== FAILED) accepted += char;
  }

  return { value: accepted, raw: accepted, completed: scanner.state() === DONE };
};

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Applies an engine pattern to a candidate string.
 *
 * Pure: the same input and pattern always produce the same result, and masking an
 * already-masked value is a no-op.
 *
 * @param input - Candidate value, masked or not.
 * @param pattern - An L1 `blocks` or L3 `regex` pattern. `date` / `time` are
 * resolvers; run them through {@link presetResolver} instead.
 */
export const applyMaskPattern = (input: string, pattern: MaskPattern): MaskResult =>
  isRegexMask(pattern) ? maskRegex(input, pattern) : maskShape(input, pattern);
