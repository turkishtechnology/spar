import {
  createIncrementalMatcher,
  stripAnchors,
  DONE,
  MORE,
  FAILED,
  type MatchState,
} from '../regex-mask';

/**
 * The corpus is Takeoff Core's own — `regex-mask-utils.spec.ts` and
 * `regex-mask-edge.spec.ts`, ported verbatim in intent. The port must classify
 * every pattern identically, or v1 and v2 fields disagree on what the user is
 * allowed to type.
 *
 * The one intentional difference: Core returns `null` on a pattern it cannot
 * analyse and discards the reason. Here the reason survives, so the field can
 * say why the mask went inert instead of going quiet.
 */
const classify = (source: string, value: string): MatchState | 'UNSUPPORTED' => {
  const compiled = createIncrementalMatcher(stripAnchors(source));
  return compiled.ok ? compiled.matcher(value) : 'UNSUPPORTED';
};

describe('regex-mask - incremental matcher', () => {
  describe('ported corpus', () => {
    const table: Array<[string, Array<[string, MatchState]>]> = [
      [
        '^[A-Z]{2}[0-9]{4}$',
        [
          ['', MORE],
          ['A', MORE],
          ['AB', MORE],
          ['AB1', MORE],
          ['AB1234', DONE],
          ['1', FAILED],
          ['ABX', FAILED],
          ['AB12345', FAILED],
        ],
      ],
      [
        '^(abc|def)$',
        [
          ['a', MORE],
          ['ab', MORE],
          ['abc', DONE],
          ['de', MORE],
          ['def', DONE],
          ['x', FAILED],
          ['abcd', FAILED],
        ],
      ],
      [
        '^[0-9,]{1,10}$',
        [
          ['', MORE],
          ['1', DONE],
          ['1,2,3', DONE],
          ['1234567890', DONE],
          ['1234567890,', FAILED],
          ['1a', FAILED],
        ],
      ],
      [
        '^[A-Z]+$',
        [
          ['A', DONE],
          ['ABC', DONE],
          ['', MORE],
          ['A1', FAILED],
        ],
      ],
      [
        '^\\d{3}-\\d{2}$',
        [
          ['1', MORE],
          ['123', MORE],
          ['123-', MORE],
          ['123-4', MORE],
          ['123-45', DONE],
          ['123-456', FAILED],
          ['12a', FAILED],
        ],
      ],
      [
        '^[a-z{}]+$',
        [
          ['a', DONE],
          ['a{}', DONE],
          ['a{}b', DONE],
          ['A', FAILED],
        ],
      ],
      [
        '^[0-9]{0,3}$',
        [
          ['', DONE],
          ['1', DONE],
          ['123', DONE],
          ['1234', FAILED],
          ['a', FAILED],
        ],
      ],
      [
        '^[A-Za-z][A-Za-z0-9_]*$',
        [
          ['myVar_1', DONE],
          ['1abc', FAILED],
          ['', MORE],
        ],
      ],
    ];

    table.forEach(([source, cases]) => {
      describe(source, () => {
        cases.forEach(([value, expected]) => {
          it(`classifies "${value}" as ${expected}`, () => {
            expect(classify(source, value)).toBe(expected);
          });
        });
      });
    });
  });

  describe('capability matrix', () => {
    const cases: Array<[string, string, MatchState]> = [
      // Optional groups — an optional country prefix.
      ['^(\\+90)?[0-9]{10}$', '5551234567', DONE],
      ['^(\\+90)?[0-9]{10}$', '+905551234567', DONE],
      ['^(\\+90)?[0-9]{10}$', '+90', MORE],
      // Multi-segment structured values.
      ['^[a-z]+@[a-z]+\\.[a-z]{2,3}$', 'a@b.co', DONE],
      ['^[a-z]+@[a-z]+\\.[a-z]{2,3}$', 'a@b.', MORE],
      ['^[a-z]+@[a-z]+\\.[a-z]{2,3}$', 'a@b.c1', FAILED],
      // Alternation between different lengths — variable-length values.
      ['^(\\d{4}|\\d{6})$', '1234', DONE],
      ['^(\\d{4}|\\d{6})$', '12345', MORE],
      ['^(\\d{4}|\\d{6})$', '123456', DONE],
      // Greedy dot with a fixed suffix.
      ['^.*-end$', 'anything-end', DONE],
      ['^.*-end$', 'anything-', MORE],
      // Escaped special characters.
      ['^\\$\\d+\\.\\d{2}$', '$12.34', DONE],
      ['^\\$\\d+\\.\\d{2}$', '$12', MORE],
      // Non-ASCII ranges.
      ['^[a-zçğıöşü]+$', 'çağrı', DONE],
      // Named capturing groups behave like plain groups.
      ['^(?<year>\\d{4})$', '2024', DONE],
      ['^(?<year>\\d{4})$', '20', MORE],
      // Bounded repetition of groups.
      ['^(ab){2,3}$', 'ab', MORE],
      ['^(ab){2,3}$', 'abab', DONE],
      ['^(ab){2,3}$', 'abababab', FAILED],
      ['^([0-9]{3}){2}$', '123', MORE],
      ['^([0-9]{3}){2}$', '123456', DONE],
    ];

    cases.forEach(([source, value, expected]) => {
      it(`/${source}/ "${value}" → ${expected}`, () => {
        expect(classify(source, value)).toBe(expected);
      });
    });
  });

  describe('unsupported syntax reports a reason instead of throwing', () => {
    const cases: Array<[string, string]> = [
      ['lookahead', '^(?=.*\\d)[a-z]+$'],
      ['lookbehind', '^(?<=\\d)[a-z]+$'],
      ['back-reference', '^(.)\\1$'],
      ['named back-reference', '^(?<c>.)\\k<c>$'],
      ['malformed (unterminated class)', '[A-Z'],
      ['malformed (unterminated group)', '(abc'],
    ];

    cases.forEach(([label, source]) => {
      it(label, () => {
        const compiled = createIncrementalMatcher(stripAnchors(source));
        expect(compiled.ok).toBe(false);
        if (compiled.ok) return;
        // The reason is the point: it is what the field warns with.
        expect(compiled.reason).toEqual(expect.any(String));
        expect(compiled.reason.length).toBeGreaterThan(0);
      });
    });
  });

  // KNOWN LIMITATION, inherited from the port. An unbounded quantifier nested
  // directly inside a bounded one makes the per-repetition boundary ambiguous
  // for the expansion strategy. Recorded so the behavior is intentional rather
  // than a surprise; such patterns are not realistic input masks.
  describe('known limitation (documented, not a regression)', () => {
    it('unbounded-inside-bounded is over-permissive', () => {
      // Ideally MORE — two outer repetitions are required. It reports DONE.
      expect(classify('^((ab)+|c){2,3}$', 'abab')).toBe(DONE);
    });
  });

  describe('stripAnchors', () => {
    it('removes a leading ^ and a trailing $', () => {
      expect(stripAnchors('^[0-9]+$')).toBe('[0-9]+');
    });

    it('leaves an unanchored pattern unchanged', () => {
      expect(stripAnchors('[0-9]+')).toBe('[0-9]+');
    });
  });
});
