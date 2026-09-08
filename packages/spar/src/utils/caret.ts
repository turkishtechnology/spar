/**
 * Anchor counting — the shared caret algorithm.
 *
 * Knowing what the user did gives the caret position in the *raw* string;
 * mapping it into the *masked* string is a second, mask-independent step.
 *
 * The rule: count the significant characters before the caret, apply the mask,
 * then walk the result until the same number of significant characters has been
 * passed. Characters a mask inserts — delimiters, thousands separators, spacing
 * — are skipped by both walks, so the caret stays anchored to the character the
 * user typed rather than to an offset that shifting separators can invalidate.
 *
 * One implementation serves L1 delimiters, L2 presets and L4 resolvers.
 *
 * @remarks
 * Two cases cannot be inferred this way, because they change the *number* of
 * significant characters rather than the separators between them: stripping a
 * leading zero, and inserting a decimal mark. A resolver doing either returns an
 * explicit caret, which overrides this mapping.
 */

/**
 * Default significance predicate: anything that is not a letter or a number is
 * treated as a separator. Covers `1.234.567,89`, `+90 (532) 123 45 67` and
 * `31/12/2025` — in all three the anchors are the digits.
 */
export const DEFAULT_INSIGNIFICANT = /[^\p{L}\p{N}]/u;

/**
 * Tests a single character against a significance predicate.
 *
 * `lastIndex` is reset first so a caller-supplied `/g` or `/y` regex cannot
 * carry state between characters.
 */
const isInsignificant = (char: string, predicate: RegExp): boolean => {
  predicate.lastIndex = 0;
  return predicate.test(char);
};

/**
 * Counts the significant characters in `value` before UTF-16 offset `offset`.
 *
 * Iterates by code point so a surrogate pair counts once, while the returned and
 * accepted offsets stay in UTF-16 units — the same units as
 * `HTMLInputElement.selectionStart`.
 */
export const countSignificantBefore = (
  value: string,
  offset: number,
  predicate: RegExp = DEFAULT_INSIGNIFICANT,
): number => {
  const limit = Math.max(0, Math.min(offset, value.length));
  let count = 0;

  for (let index = 0; index < limit; ) {
    const char = String.fromCodePoint(value.codePointAt(index)!);
    if (!isInsignificant(char, predicate)) count += 1;
    index += char.length;
  }

  return count;
};

/**
 * Counts the separators between the `count`-th significant character and
 * `offset` — how far past its anchor the caret was sitting.
 *
 * Anchor counting alone cannot tell `1,234|.9` from `1,234.|9`: both have four
 * significant characters before them. The difference is the separator run the
 * caret had already crossed, so it is carried across with the count.
 */
const separatorsAfterAnchor = (value: string, offset: number, predicate: RegExp): number => {
  const limit = Math.max(0, Math.min(offset, value.length));
  let run = 0;

  for (let index = 0; index < limit; ) {
    const char = String.fromCodePoint(value.codePointAt(index)!);
    run = isInsignificant(char, predicate) ? run + 1 : 0;
    index += char.length;
  }

  return run;
};

/**
 * Returns the offset in `value` just after its `count`-th significant character,
 * plus up to `skip` of the separators that follow it.
 *
 * `count` of 0 yields 0 — before everything — unless separators are skipped,
 * which is what puts the caret after a leading prefix such as a currency sign.
 * A `count` larger than the number of significant characters available yields
 * `value.length`.
 */
export const offsetAfterSignificant = (
  value: string,
  count: number,
  predicate: RegExp = DEFAULT_INSIGNIFICANT,
  skip = 0,
): number => {
  /** Walks past up to `skip` separators from `index`. */
  const withSkipped = (index: number): number => {
    let cursor = index;
    let remainingSkips = skip;

    while (remainingSkips > 0 && cursor < value.length) {
      const char = String.fromCodePoint(value.codePointAt(cursor)!);
      if (!isInsignificant(char, predicate)) break;
      cursor += char.length;
      remainingSkips -= 1;
    }

    return cursor;
  };

  if (count <= 0) return withSkipped(0);

  let remaining = count;

  for (let index = 0; index < value.length; ) {
    const char = String.fromCodePoint(value.codePointAt(index)!);
    const nextIndex = index + char.length;

    if (!isInsignificant(char, predicate)) {
      remaining -= 1;
      if (remaining === 0) return withSkipped(nextIndex);
    }

    index = nextIndex;
  }

  return value.length;
};

/** Two characters are the same anchor even if the mask changed their case. */
const sameAnchor = (a: string, b: string): boolean =>
  a === b || a.toLowerCase() === b.toLowerCase();

/** The significant characters of `value`, up to `limit` UTF-16 units. */
const significantChars = (value: string, predicate: RegExp, limit = value.length): string[] => {
  const stop = Math.max(0, Math.min(limit, value.length));
  const chars: string[] = [];

  for (let index = 0; index < stop; ) {
    const char = String.fromCodePoint(value.codePointAt(index)!);
    if (!isInsignificant(char, predicate)) chars.push(char);
    index += char.length;
  }

  return chars;
};

/** Whether `needle` appears in `haystack` in order — the mask only removed. */
const isSubsequence = (needle: string[], haystack: string[]): boolean => {
  let cursor = 0;
  for (const char of haystack) {
    if (cursor < needle.length && sameAnchor(needle[cursor]!, char)) cursor += 1;
  }
  return cursor === needle.length;
};

/**
 * Counts the anchors before `caret` that survived the mask.
 *
 * Plain counting treats every significant character in the raw string as an
 * anchor, the rejected ones included — pasting `a9` into a digits-only field
 * counts the `a` and pushes the caret one place right of where the `9` landed.
 * When the masked value's anchors are a *subsequence* of the raw one's, the mask
 * only removed characters, and matching the two sequences says exactly which
 * ones went; anything unmatched anchored nothing.
 *
 * The subsequence test is what keeps this safe for the other kind of mask. One
 * that rewrites in place or synthesises characters — a day clamped from `39` to
 * `03`, a zero-pad — is not a pure removal, so it falls back to plain counting
 * rather than mistaking a rewrite for a rejection.
 */
const anchorsBefore = (from: string, caret: number, to: string, predicate: RegExp): number => {
  const before = significantChars(from, predicate, caret);
  const source = significantChars(from, predicate);
  const target = significantChars(to, predicate);

  if (!isSubsequence(target, source)) return before.length;

  let cursor = 0;
  let count = 0;

  for (const char of before) {
    const candidate = target[cursor];
    if (candidate !== undefined && sameAnchor(candidate, char)) {
      cursor += 1;
      count += 1;
    }
  }

  return count;
};

/**
 * Maps a caret offset from one string into another by anchor counting.
 *
 * @param from - The string the caret offset refers to.
 * @param caret - Caret offset within `from`, in UTF-16 units.
 * @param to - The string to place the caret in.
 * @param predicate - Which characters count as separators.
 * @returns The caret offset within `to`.
 *
 * @example
 * ```ts
 * // '1234' with the caret after '2', masked to '12/34'
 * mapCaret('1234', 2, '12/34'); // 2 — still after '2', before the delimiter
 * // one more digit typed: '12345' -> '12/345', caret was after '3'
 * mapCaret('12345', 3, '12/345'); // 4 — after '3', delimiter skipped
 * // a caret already past a separator stays past it
 * mapCaret('1,234.9', 6, '1,234.9'); // 6 — after '.', not before it
 * ```
 */
export const mapCaret = (
  from: string,
  caret: number,
  to: string,
  predicate: RegExp = DEFAULT_INSIGNIFICANT,
): number =>
  offsetAfterSignificant(
    to,
    anchorsBefore(from, caret, to, predicate),
    predicate,
    separatorsAfterAnchor(from, caret, predicate),
  );
