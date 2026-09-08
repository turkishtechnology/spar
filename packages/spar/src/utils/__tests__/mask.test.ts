import type { Mask, MaskPreset } from '@/types';
import { applyMaskPattern, getMaskBlocks, isMaskResolver, presetResolver } from '../mask';

/**
 * `date` and `time` are resolvers, not engine branches, so a test builds the
 * resolver and calls it. The assertions stay phrased in terms of the pattern
 * object — which is what the spec's tables are written against — while going
 * through the exact path a consumer's own resolver goes through.
 */
const applyPreset = (input: string, preset: MaskPreset) => {
  const resolver = presetResolver(preset);
  if (!resolver) throw new Error('not a date/time mask');
  return resolver(input, { caret: input.length, previousValue: '' });
};

describe('mask - L1 shape', () => {
  it('inserts a delimiter between full blocks', () => {
    const result = applyMaskPattern('123456789', { blocks: [3, 3, 3], delimiter: '-' });
    expect(result.value).toBe('123-456-789');
    expect(result.raw).toBe('123456789');
    expect(result.completed).toBe(true);
  });

  it('does not append a trailing delimiter while a block is still the last thing typed', () => {
    // The delimiter belongs between characters, not after them: a field that
    // shows "12/" the moment the day is complete puts the caret past a
    // separator the user has not reached yet.
    expect(applyMaskPattern('12', { blocks: [2, 2], delimiter: '/' }).value).toBe('12');
    expect(applyMaskPattern('123', { blocks: [2, 2], delimiter: '/' }).value).toBe('12/3');
  });

  it('reports incomplete until every block is filled', () => {
    const pattern = { blocks: [2, 2], delimiter: '/' };
    expect(applyMaskPattern('123', pattern).completed).toBe(false);
    expect(applyMaskPattern('1234', pattern).completed).toBe(true);
  });

  it('truncates past capacity', () => {
    const result = applyMaskPattern('123456', { blocks: [2, 2], delimiter: '/' });
    expect(result.value).toBe('12/34');
    expect(result.raw).toBe('1234');
  });

  it('is idempotent — masking an already-masked value changes nothing', () => {
    const pattern = { blocks: [3, 3, 3], delimiter: '-' };
    const once = applyMaskPattern('123456789', pattern);
    expect(applyMaskPattern(once.value, pattern)).toEqual(once);
  });

  it('uses per-gap delimiters and repeats the last one when the array is short', () => {
    const result = applyMaskPattern('1234567890', {
      blocks: [3, 3, 2, 2],
      delimiters: ['(', ')'],
    });
    // Third gap has no entry, so ')' — the last given — is reused.
    expect(result.value).toBe('123(456)78)90');
  });

  it('prefers delimiters over delimiter when both are given', () => {
    const result = applyMaskPattern('123456', {
      blocks: [3, 3],
      delimiter: '-',
      delimiters: [' '],
    });
    expect(result.value).toBe('123 456');
  });

  it('strips every distinct delimiter before re-masking', () => {
    const pattern = { blocks: [3, 3, 2, 2], delimiters: ['(', ')', ' '] };
    const once = applyMaskPattern('1234567890', pattern);
    expect(applyMaskPattern(once.value, pattern).raw).toBe('1234567890');
  });

  it('filters to digits with numericOnly', () => {
    const result = applyMaskPattern('12a34b', {
      blocks: [2, 2],
      delimiter: '/',
      numericOnly: true,
    });
    expect(result.raw).toBe('1234');
  });

  it('filters to letters with letterOnly, accepting non-ASCII', () => {
    const result = applyMaskPattern('ç1a2ğ', { blocks: [5], letterOnly: true });
    expect(result.raw).toBe('çağ');
  });

  it('applies uppercase and lowercase', () => {
    expect(applyMaskPattern('ab', { blocks: [2], uppercase: true }).value).toBe('AB');
    expect(applyMaskPattern('AB', { blocks: [2], lowercase: true }).value).toBe('ab');
  });

  it('lets uppercase win when both case flags are set', () => {
    expect(applyMaskPattern('aB', { blocks: [2], uppercase: true, lowercase: true }).value).toBe(
      'AB',
    );
  });

  it('reports an empty pattern as incomplete rather than complete-by-vacuity', () => {
    expect(applyMaskPattern('', { blocks: [] }).completed).toBe(false);
  });
});

describe('mask - L2 date', () => {
  const dmy = { date: true as const, delimiter: '/' };

  it('defaults to d/m/Y', () => {
    expect(applyPreset('31122024', dmy).value).toBe('31/12/2024');
  });

  describe('day, per block', () => {
    it("turns '00' into '01'", () => {
      expect(applyPreset('00', dmy).value).toBe('01');
    });

    it('zero-pads a first digit above 3', () => {
      expect(applyPreset('4', dmy).value).toBe('04');
    });

    it('clamps above 31', () => {
      expect(applyPreset('35', dmy).value).toBe('31');
    });
  });

  describe('month, per block', () => {
    it("turns '00' into '01'", () => {
      expect(applyPreset('1200', dmy).value).toBe('12/01');
    });

    it('zero-pads a first digit above 1', () => {
      expect(applyPreset('125', dmy).value).toBe('12/05');
    });

    it('clamps above 12', () => {
      expect(applyPreset('1213', dmy).value).toBe('12/12');
    });
  });

  describe('once the value is complete', () => {
    it("clamps the day to the month's real length", () => {
      expect(applyPreset('31042024', dmy).value).toBe('30/04/2024');
    });

    it('rejects 29 February in a common year', () => {
      expect(applyPreset('29022023', dmy).value).toBe('28/02/2023');
    });

    it('accepts 29 February in a leap year', () => {
      expect(applyPreset('29022024', dmy).value).toBe('29/02/2024');
    });

    it('treats 2000 as a leap year and 1900 as not', () => {
      expect(applyPreset('29022000', dmy).value).toBe('29/02/2000');
      expect(applyPreset('29021900', dmy).value).toBe('28/02/1900');
    });

    it('emits an ISO value', () => {
      expect(applyPreset('31122024', dmy).iso).toBe('2024-12-31');
    });
  });

  describe('range', () => {
    it('clamps above dateMax', () => {
      const result = applyPreset('31122024', { ...dmy, dateMax: '2020-12-31' });
      expect(result.value).toBe('31/12/2020');
    });

    it('clamps below dateMin', () => {
      const result = applyPreset('01012019', { ...dmy, dateMin: '2020-01-01' });
      expect(result.value).toBe('01/01/2020');
    });

    it('leaves a date inside the range alone', () => {
      const bounded = { ...dmy, dateMin: '2020-01-01', dateMax: '2030-12-31' };
      expect(applyPreset('15062024', bounded).value).toBe('15/06/2024');
    });

    it('is ignored while the value is still incomplete', () => {
      // Clamping mid-typing would fight the user for every keystroke.
      const result = applyPreset('3112', { ...dmy, dateMin: '2030-01-01' });
      expect(result.value).toBe('31/12');
    });

    it('accepts an absent bound instead of throwing (DEVIATION 6)', () => {
      expect(() => applyPreset('31122024', dmy)).not.toThrow();
    });
  });

  describe('two-digit year', () => {
    const dmyShort = { date: true as const, delimiter: '/', datePattern: ['d', 'm', 'y'] };

    it('formats as two digits', () => {
      expect(applyPreset('311219', dmyShort).value).toBe('31/12/19');
    });

    it('skips range clamping entirely (DEVIATION 5)', () => {
      // cleave compares '19' against '2020-01-01' and snaps every such value to
      // dateMin. A two-digit year is not comparable to an ISO bound, so the
      // range is skipped and the per-block clamps still apply.
      const result = applyPreset('311219', {
        date: true,
        delimiter: '/',
        datePattern: ['d', 'm', 'y'],
        dateMin: '2020-01-01',
      });
      expect(result.value).toBe('31/12/19');
    });

    it('emits no ISO value, because the century is unknown', () => {
      const result = applyPreset('311219', {
        date: true,
        delimiter: '/',
        datePattern: ['d', 'm', 'y'],
      });
      expect(result.completed).toBe(true);
      expect(result.iso).toBeUndefined();
    });
  });

  it('honours a reordered pattern', () => {
    const result = applyPreset('20241231', {
      date: true,
      delimiter: '-',
      datePattern: ['Y', 'm', 'd'],
    });
    expect(result.value).toBe('2024-12-31');
    expect(result.iso).toBe('2024-12-31');
  });
});

describe('mask - L2 time', () => {
  const hm = { time: true as const, delimiter: ':' };

  it('defaults to h:m in 24-hour format', () => {
    expect(applyPreset('2359', hm).value).toBe('23:59');
    expect(applyPreset('2359', hm).iso).toBe('23:59');
  });

  it('zero-pads an hour first digit above 2', () => {
    expect(applyPreset('9', hm).value).toBe('09');
  });

  it('clamps the hour to 23', () => {
    expect(applyPreset('25', hm).value).toBe('23');
  });

  it('clamps minutes to 59, not 60 (DEVIATION 1)', () => {
    // cleave uses Math.min(minute, 60); 60 is not a minute.
    expect(applyPreset('2360', hm).value).toBe('23:06');
    expect(applyPreset('2361', hm).value).toBe('23:06');
  });

  it('clamps seconds to 59 (DEVIATION 2)', () => {
    const hms = { time: true as const, delimiter: ':', timePattern: ['h', 'm', 's'] };
    expect(applyPreset('120059', hms).value).toBe('12:00:59');
    expect(applyPreset('120060', hms).value).toBe('12:00:06');
  });

  describe('12-hour format (DEVIATION 3 — cleave ignores timeFormat here)', () => {
    const h12 = { time: true as const, delimiter: ':', timeFormat: '12' as const };

    it('zero-pads a first digit above 1', () => {
      expect(applyPreset('2', h12).value).toBe('02');
    });

    it('clamps the hour to 12, not 23', () => {
      expect(applyPreset('13', h12).value).toBe('12');
    });
  });

  it('emits an ISO value with seconds when the pattern has them', () => {
    const result = applyPreset('120059', {
      time: true,
      delimiter: ':',
      timePattern: ['h', 'm', 's'],
    });
    expect(result.iso).toBe('12:00:59');
  });

  it('drops non-digits', () => {
    expect(applyPreset('1a2b:3c4', hm).raw).toBe('1234');
  });
});

describe('mask - L3 regex', () => {
  it('accepts characters that keep the value a valid prefix', () => {
    const result = applyMaskPattern('AB1234', { regex: /^[A-Z]{2}[0-9]{4}$/ });
    expect(result.value).toBe('AB1234');
    expect(result.completed).toBe(true);
  });

  it('drops characters that would make the value unmatchable', () => {
    const result = applyMaskPattern('A!B?1234', { regex: /^[A-Z]{2}[0-9]{4}$/ });
    expect(result.value).toBe('AB1234');
  });

  it('reports incomplete while the value is still only a prefix', () => {
    const result = applyMaskPattern('AB12', { regex: /^[A-Z]{2}[0-9]{4}$/ });
    expect(result.value).toBe('AB12');
    expect(result.completed).toBe(false);
  });

  it('accepts a pattern given as a string', () => {
    expect(applyMaskPattern('AB1234', { regex: '^[A-Z]{2}[0-9]{4}$' }).value).toBe('AB1234');
  });

  it('applies uppercase before matching, so a lowercase keystroke is not rejected', () => {
    const result = applyMaskPattern('ab1234', { regex: /^[A-Z]{2}[0-9]{4}$/, uppercase: true });
    expect(result.value).toBe('AB1234');
  });

  it('applies lowercase', () => {
    const result = applyMaskPattern('AB', { regex: /^[a-z]{2}$/, lowercase: true });
    expect(result.value).toBe('ab');
  });

  describe('a pattern the matcher cannot analyse', () => {
    // §10.7: degrading is acceptable; degrading silently is not.
    const lookbehind = { regex: /^(?<=\d)[a-z]+$/ };

    it('passes the value through untouched rather than locking the field', () => {
      const result = applyMaskPattern('anything at all', lookbehind);
      expect(result.value).toBe('anything at all');
    });

    it('reports the reason so the caller can surface it', () => {
      const result = applyMaskPattern('abc', lookbehind);
      expect(result.unsupportedReason).toEqual(expect.any(String));
      expect(result.unsupportedReason).not.toHaveLength(0);
    });

    it('reports completed, so an inert mask cannot block submit logic forever', () => {
      expect(applyMaskPattern('abc', lookbehind).completed).toBe(true);
    });
  });
});

describe('mask - helpers', () => {
  it('isMaskResolver distinguishes a function from a pattern', () => {
    const resolver: Mask = (value) => ({ value });
    expect(isMaskResolver(resolver)).toBe(true);
    expect(isMaskResolver({ blocks: [2] })).toBe(false);
  });

  describe('getMaskBlocks', () => {
    it("returns an L1 pattern's own blocks", () => {
      expect(getMaskBlocks({ blocks: [3, 3, 4] })).toEqual([3, 3, 4]);
    });

    it('derives date blocks from the pattern tokens', () => {
      expect(getMaskBlocks({ date: true, datePattern: ['d', 'm', 'Y'] })).toEqual([2, 2, 4]);
      expect(getMaskBlocks({ date: true, datePattern: ['Y', 'm'] })).toEqual([4, 2]);
    });

    it('derives two-digit time blocks', () => {
      expect(getMaskBlocks({ time: true, timePattern: ['h', 'm', 's'] })).toEqual([2, 2, 2]);
    });

    it('returns nothing for a regex mask, which has no block structure', () => {
      expect(getMaskBlocks({ regex: /^\d+$/ })).toEqual([]);
    });
  });
});
