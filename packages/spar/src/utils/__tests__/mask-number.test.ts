import type { MaskNumberOptions } from '@/types';
import { createNumberMask, groupDigits } from '../mask-number';
import { getMaskBlocks, presetResolver } from '../mask';

/**
 * `number` is a resolver, not an engine branch, so every test builds the resolver
 * and calls it — the exact path a consumer's own resolver goes through.
 */
const apply = (input: string, options: Omit<MaskNumberOptions, 'number'> = {}) =>
  createNumberMask({ number: true, ...options })(input, {
    caret: input.length,
    previousValue: '',
  });

/** The v1 `numeral` demo's configuration, reached through the locale. */
const tr = { numberLocale: 'tr-TR' } as const;

describe('mask - L2 number', () => {
  it('groups thousands and marks the fraction, matching the v1 numeral demo', () => {
    // v1: `{ numeral: true, delimiter: '.', numeralDecimalMark: ',' }`,
    // placeholder `1.234.567,89`. Here the same output comes from the locale.
    expect(apply('1234567,89', tr).value).toBe('1.234.567,89');
    // Digits with no mark are an integer, not a scaled one: nine digits typed
    // into a currency field are a hundred and twenty-three million.
    expect(apply('123456789', tr).value).toBe('123.456.789');
  });

  it('regroups as the value grows', () => {
    expect(apply('1', tr).value).toBe('1');
    expect(apply('12', tr).value).toBe('12');
    expect(apply('123', tr).value).toBe('123');
    expect(apply('1234', tr).value).toBe('1.234');
    expect(apply('12345', tr).value).toBe('12.345');
    expect(apply('1234567', tr).value).toBe('1.234.567');
  });

  it('is idempotent — masking an already-masked value changes nothing', () => {
    for (const locale of ['tr-TR', 'en-US', 'en-IN', 'fr-FR']) {
      const once = apply('123456789', { numberLocale: locale }).value;
      const twice = apply(once, { numberLocale: locale }).value;
      expect(twice).toBe(once);
    }
  });

  it('reads separators and group sizes off Intl rather than a locale table', () => {
    expect(apply('11234567', { numberLocale: 'en-US', numberDecimalScale: 0 }).value).toBe(
      '11,234,567',
    );
    expect(apply('11234567', { numberLocale: 'de-DE', numberDecimalScale: 0 }).value).toBe(
      '11.234.567',
    );
    // Lakh grouping: 3 then 2, derived from `en-IN` — no `numeralThousandsGroupStyle`.
    expect(apply('11234567', { numberLocale: 'en-IN', numberDecimalScale: 0 }).value).toBe(
      '1,12,34,567',
    );
  });

  it('separates the grouping *pattern* from the grouping *character*', () => {
    // Lakh sizes, dots between them — a combination cleave's enum cannot express.
    expect(
      apply('11234567', { numberLocale: 'en-IN', delimiter: '.', numberDecimalScale: 0 }).value,
    ).toBe('1.12.34.567');
  });

  it('turns grouping off with an empty delimiter', () => {
    // L1 defaults `delimiter` to '' meaning "no separator"; here unset means
    // "the locale's", so switching grouping off has to be explicit.
    expect(apply('1234567', { ...tr, delimiter: '' }).value).toBe('1234567');
    expect(apply('1234567,89', { ...tr, delimiter: '' }).value).toBe('1234567,89');
  });

  it('emits a Number()-parseable iso and a group-free raw', () => {
    const result = apply('1234567,89', tr);
    expect(result.raw).toBe('1234567,89');
    expect(result.iso).toBe('1234567.89');
    expect(Number(result.iso)).toBe(1234567.89);
    expect(result.completed).toBe(true);
  });

  it('reports incomplete until an integer digit exists', () => {
    expect(apply('', tr).completed).toBe(false);
    expect(apply('', tr).iso).toBeUndefined();
    expect(apply('-', tr).completed).toBe(false);
    expect(apply('-', tr).value).toBe('-');
    expect(apply('1', tr).completed).toBe(true);
  });

  it('renders a lone minus, so the keystroke is not silently dropped', () => {
    expect(apply('-', tr).value).toBe('-');
    expect(apply('-1234', tr).value).toBe('-1.234');
    expect(apply('-1234', tr).iso).toBe('-1234');
  });

  it('accepts the minus anywhere, since the caret may be anywhere', () => {
    expect(apply('12-34', tr).value).toBe('-1.234');
  });

  it('rejects the minus under numberPositiveOnly', () => {
    expect(apply('-1234', { ...tr, numberPositiveOnly: true }).value).toBe('1.234');
    expect(apply('-1234', { ...tr, numberPositiveOnly: true }).iso).toBe('1234');
  });

  it('strips leading zeros unconditionally', () => {
    expect(apply('007', tr).value).toBe('7');
    expect(apply('0', tr).value).toBe('0');
    expect(apply('000', tr).value).toBe('0');
  });

  it('supplies the integer zero when the fraction is opened first', () => {
    expect(apply(',', tr).value).toBe('0,');
    expect(apply(',5', tr).value).toBe('0,5');
    expect(apply('0,5', tr).iso).toBe('0.5');
  });

  it('honours only the first decimal mark', () => {
    expect(apply('1,2,3', tr).value).toBe('1,23');
  });

  it('caps the fraction at numberDecimalScale', () => {
    expect(apply('1,239', tr).value).toBe('1,23');
    expect(apply('1,239', { ...tr, numberDecimalScale: 3 }).value).toBe('1,239');
  });

  it('makes the decimal mark inert at scale 0', () => {
    const options = { ...tr, numberDecimalScale: 0 };
    expect(apply('12,34', options).value).toBe('1.234');
    expect(apply('12,34', options).iso).toBe('1234');
  });

  it('caps the integer part at numberIntegerScale', () => {
    expect(apply('123456789', { ...tr, numberIntegerScale: 4 }).value).toBe('1.234');
  });

  it('overrides the locale separators when asked', () => {
    const result = apply('1234567.89', {
      numberLocale: 'en-US',
      delimiter: ' ',
      numberDecimalMark: '.',
    });
    expect(result.value).toBe('1 234 567.89');
  });

  it('accepts ASCII . as a decimal alias only where . is unused', () => {
    // `en-US` already decides with '.', so nothing changes.
    expect(apply('12.5', { numberLocale: 'en-US' }).value).toBe('12.5');
    // `fr-FR` groups with a narrow space and decides with ',' — the numeric
    // keypad's '.' is accepted.
    expect(apply('12.5', { numberLocale: 'fr-FR' }).value).toBe('12,5');
    // `tr-TR` groups with '.', so it must stay a group separator: a pasted
    // `1.234` is twelve hundred and thirty-four, not one point two.
    expect(apply('1.234', tr).value).toBe('1.234');
    expect(apply('1.234', tr).iso).toBe('1234');
  });

  it('survives an invalid locale tag instead of throwing', () => {
    expect(() => apply('1234', { numberLocale: 'not a locale' })).not.toThrow();
    expect(apply('1234', { numberLocale: 'not a locale' }).completed).toBe(true);
  });

  it('carries backspace through from the options, like the other factories', () => {
    expect(createNumberMask({ number: true }).backspace).toBeUndefined();
    expect(createNumberMask({ number: true, backspace: false }).backspace).toBe(false);
  });
});

describe('mask - number wiring', () => {
  it('is reachable through the { number: true } sugar', () => {
    const resolver = presetResolver({ number: true, numberLocale: 'tr-TR' });
    expect(resolver).not.toBeNull();
    expect(resolver!('123456', { caret: 6, previousValue: '' }).value).toBe('123.456');
  });

  it('has no blocks — its grouping is variable-width and right-to-left', () => {
    expect(getMaskBlocks({ number: true })).toEqual([]);
  });
});

describe('groupDigits', () => {
  it('groups right-to-left with a primary and a secondary size', () => {
    expect(groupDigits('11234567', 3, 3, ',')).toBe('11,234,567');
    expect(groupDigits('11234567', 3, 2, ',')).toBe('1,12,34,567');
  });

  it('leaves a value shorter than one group alone', () => {
    expect(groupDigits('12', 3, 3, ',')).toBe('12');
    expect(groupDigits('123', 3, 3, ',')).toBe('123');
  });

  it('passes through when there is nothing to group with', () => {
    expect(groupDigits('11234567', 3, 3, '')).toBe('11234567');
    expect(groupDigits('11234567', 0, 3, ',')).toBe('11234567');
  });
});
