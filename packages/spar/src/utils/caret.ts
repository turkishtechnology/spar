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
 * Returns the offset in `value` just after its `count`-th significant character.
 *
 * `count` of 0 yields 0; a `count` larger than the number of significant
 * characters available yields `value.length`.
 */
export const offsetAfterSignificant = (
  value: string,
  count: number,
  predicate: RegExp = DEFAULT_INSIGNIFICANT,
): number => {
  if (count <= 0) return 0;

  let remaining = count;

  for (let index = 0; index < value.length; ) {
    const char = String.fromCodePoint(value.codePointAt(index)!);
    const nextIndex = index + char.length;

    if (!isInsignificant(char, predicate)) {
      remaining -= 1;
      if (remaining === 0) return nextIndex;
    }

    index = nextIndex;
  }

  return value.length;
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
 * ```
 */
export const mapCaret = (
  from: string,
  caret: number,
  to: string,
  predicate: RegExp = DEFAULT_INSIGNIFICANT,
): number => offsetAfterSignificant(to, countSignificantBefore(from, caret, predicate), predicate);
