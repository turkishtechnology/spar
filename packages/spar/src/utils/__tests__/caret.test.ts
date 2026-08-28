import { countSignificantBefore, mapCaret, offsetAfterSignificant } from '../caret';

/**
 * Anchor counting is the whole of Spar's caret restoration, and every mask layer
 * routes through it, so it is tested here on its own rather than only through a
 * rendered field.
 */
describe('caret - anchor counting', () => {
  describe('countSignificantBefore', () => {
    it('counts every character when none are insignificant', () => {
      expect(countSignificantBefore('1234', 3)).toBe(3);
    });

    it('skips delimiters', () => {
      // "12/34" — three characters precede the caret, but only two are digits.
      expect(countSignificantBefore('12/34', 3)).toBe(2);
    });

    it('treats a caret sitting on a delimiter as being before it', () => {
      expect(countSignificantBefore('12/34', 2)).toBe(2);
    });

    it('returns 0 at the start and the full count at the end', () => {
      expect(countSignificantBefore('12/34', 0)).toBe(0);
      expect(countSignificantBefore('12/34', 5)).toBe(4);
    });

    it('clamps an offset past the end rather than overcounting', () => {
      expect(countSignificantBefore('12/34', 99)).toBe(4);
    });

    it('clamps a negative offset to 0', () => {
      expect(countSignificantBefore('12/34', -3)).toBe(0);
    });

    it('honours a custom predicate', () => {
      // Spaces only: the dash now counts as significant.
      expect(countSignificantBefore('12 -34', 5, /\s/)).toBe(4);
    });

    it('is unaffected by a sticky or global custom predicate', () => {
      const sticky = /[^\p{L}\p{N}]/gu;
      expect(countSignificantBefore('1-2-3', 5, sticky)).toBe(3);
      // Same call again: lastIndex must not have carried over.
      expect(countSignificantBefore('1-2-3', 5, sticky)).toBe(3);
    });
  });

  describe('offsetAfterSignificant', () => {
    it('lands after the nth significant character', () => {
      expect(offsetAfterSignificant('12/34', 2)).toBe(2);
      expect(offsetAfterSignificant('12/34', 3)).toBe(4);
    });

    it('returns 0 for a count of 0 or less', () => {
      expect(offsetAfterSignificant('12/34', 0)).toBe(0);
      expect(offsetAfterSignificant('12/34', -1)).toBe(0);
    });

    it('returns the full length when the count exceeds what is there', () => {
      expect(offsetAfterSignificant('12/34', 9)).toBe(5);
    });

    it('does not stop short of a trailing delimiter it has not passed', () => {
      // Two digits consumed; the caret belongs before the delimiter, not after.
      expect(offsetAfterSignificant('12/', 2)).toBe(2);
    });
  });

  describe('mapCaret', () => {
    it('moves the caret past a delimiter the mask inserted', () => {
      // Typed the third digit of "123"; the mask made it "12/3".
      expect(mapCaret('123', 3, '12/3')).toBe(4);
    });

    it('keeps the caret in place when the mask changed nothing', () => {
      expect(mapCaret('12/34', 4, '12/34')).toBe(4);
    });

    it('pulls the caret back when the mask removed a delimiter', () => {
      expect(mapCaret('12/34', 4, '1234')).toBe(3);
    });

    it('maps into the middle of a fully reformatted value', () => {
      // Credit-card style regrouping: 4 digits precede the caret either way.
      expect(mapCaret('4111111111111111', 4, '4111 1111 1111 1111')).toBe(4);
      expect(mapCaret('4111111111111111', 6, '4111 1111 1111 1111')).toBe(7);
    });

    it('handles an empty target', () => {
      expect(mapCaret('12/34', 3, '')).toBe(0);
    });

    it('counts an astral character as one anchor but returns UTF-16 offsets', () => {
      // '😀' is two UTF-16 units and insignificant under the default predicate.
      const from = 'a😀b';
      expect(mapCaret(from, from.length, 'ab')).toBe(2);
    });
  });
});
