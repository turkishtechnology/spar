/**
 * The `number` mask, as a {@link MaskResolver}.
 *
 * Like `./mask-date.ts` and `./mask-time.ts`, a resolver rather than an engine
 * branch — same public contract as anything you write yourself.
 *
 * **Not** ported from cleave. cleave's `NumeralFormatter` reaches its grouping
 * through `numeralThousandsGroupStyle`, an enum (`thousand` / `lakh` / `wan`)
 * that hardcodes three of the world's grouping conventions and cannot express a
 * fourth. Here the separators and the group sizes are *read off*
 * `Intl.NumberFormat`, which every runtime already ships:
 *
 * ```ts
 * new Intl.NumberFormat('en-IN').formatToParts(-11234567.5)
 * // …integer '1', group, integer '12', group, integer '34', group, integer '567'…
 * // → primary group 3, secondary group 2 — lakh, without a lakh table.
 * ```
 *
 * So `numeralThousandsGroupStyle: 'lakh'` becomes `numberLocale: 'en-IN'`, and
 * `'none'` becomes `delimiter: ''`. No locale data enters the package, and the
 * zero-dependency rule holds.
 *
 * Three cleave options are deliberately absent; see §10.13 M3 of the Input spec
 * for the reasoning: `prefix` / `suffix` (the compound already has `Input.Prefix`
 * and `Input.Suffix`, which sit outside the value and so need no stripping, no
 * caret override and no "can I delete the symbol" semantics), a min/max range
 * (a number has no completion signal, so there is no moment at which clamping
 * would not fight the user mid-keystroke — that belongs in validation), and
 * `fixedDecimalScale` (padding the fraction is a blur-time affordance, and this
 * layer never sees blur).
 */

import type { MaskNumberOptions, MaskResolver, MaskResolverResult } from '@/types';

/** cleave's `numeralDecimalScale` default, kept so v1 numbers port unchanged. */
const DEFAULT_DECIMAL_SCALE = 2;

/**
 * Grouping and separators for one locale, as derived from `Intl.NumberFormat`.
 *
 * `primaryGroup` is the rightmost group's size, `secondaryGroup` every group to
 * its left — the only two numbers needed to express thousand *and* lakh
 * grouping.
 */
interface NumberLocaleConfig {
  group: string;
  decimal: string;
  primaryGroup: number;
  secondaryGroup: number;
}

/**
 * Last-resort configuration, used only when `Intl.NumberFormat` is unavailable
 * or throws on the tag it was given. Five values rather than a locale table.
 */
const FALLBACK_CONFIG: NumberLocaleConfig = {
  group: ',',
  decimal: '.',
  primaryGroup: 3,
  secondaryGroup: 3,
};

/**
 * A probe with enough integer digits to expose a secondary group. `en-US` formats
 * it as `-11,234,567.5` (groups 3/3), `en-IN` as `-1,12,34,567.5` (groups 3/2).
 */
const PROBE = -11234567.5;

const readConfig = (locale: string | undefined): NumberLocaleConfig => {
  const parts = new Intl.NumberFormat(locale).formatToParts(PROBE);

  const group = parts.find((part) => part.type === 'group')?.value ?? '';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const integers = parts.filter((part) => part.type === 'integer').map((part) => part.value.length);

  // Group sizes are read from the right: the last chunk is the primary group,
  // the one before it the secondary. A locale that does not group at all leaves
  // a single chunk, and both fall back to 3 — harmless, since `group` is then
  // empty and no separator is inserted.
  const primaryGroup = integers[integers.length - 1] ?? 3;
  const secondaryGroup = integers.length > 1 ? (integers[integers.length - 2] ?? 3) : primaryGroup;

  return { group, decimal, primaryGroup, secondaryGroup };
};

/**
 * Derived configurations, keyed by locale tag.
 *
 * `formatToParts` allocates an array per call, so it must not run per keystroke.
 * Same reasoning as the L3 matcher cache in `./mask.ts`.
 */
const configCache = new Map<string, NumberLocaleConfig>();

const getNumberLocaleConfig = (locale: string | undefined): NumberLocaleConfig => {
  const key = locale ?? '';
  const cached = configCache.get(key);
  if (cached) return cached;

  let config: NumberLocaleConfig;
  try {
    config = readConfig(locale);
  } catch {
    // An invalid tag must not take the field down with it. Try the runtime
    // default before giving up on Intl entirely.
    try {
      config = readConfig(undefined);
    } catch {
      config = FALLBACK_CONFIG;
    }
  }

  configCache.set(key, config);
  return config;
};

const isDigit = (char: string): boolean => char >= '0' && char <= '9';

/**
 * Inserts `separator` into `digits` right-to-left: one primary group at the end,
 * then secondary groups. `primary` of 3 and `secondary` of 3 give thousands;
 * 3 and 2 give lakh.
 */
export const groupDigits = (
  digits: string,
  primary: number,
  secondary: number,
  separator: string,
): string => {
  if (!separator || primary < 1 || secondary < 1 || digits.length <= primary) return digits;

  const chunks = [digits.slice(-primary)];
  let rest = digits.slice(0, -primary);

  while (rest.length > secondary) {
    chunks.unshift(rest.slice(-secondary));
    rest = rest.slice(0, -secondary);
  }
  if (rest) chunks.unshift(rest);

  return chunks.join(separator);
};

const format = (input: string, options: MaskNumberOptions): MaskResolverResult => {
  const config = getNumberLocaleConfig(options.numberLocale);
  const group = options.delimiter ?? config.group;
  const decimalMark = options.numberDecimalMark ?? config.decimal;
  const decimalScale = options.numberDecimalScale ?? DEFAULT_DECIMAL_SCALE;
  const allowDecimal = decimalScale > 0;

  // The minus sign is a character the user *types*, so it has to round-trip
  // through the keyboard: ASCII only, wherever in the string it landed. The
  // group separator and the decimal mark are characters the mask *inserts*, so
  // those may be locale glyphs.
  const negative = !options.numberPositiveOnly && input.includes('-');

  // The decimal mark is exactly the configured one — plus ASCII `.` when the
  // configuration uses it for neither role, so a numeric keypad still works in
  // a locale where `.` is unused. In `tr-TR` (`.` groups, `,` decides) it is not
  // an alias, which is what keeps a pasted `1.234` intact.
  const dotIsAlias = decimalMark !== '.' && group !== '.';
  const isDecimalMark = (char: string): boolean =>
    char === decimalMark || (dotIsAlias && char === '.');

  let integerDigits = '';
  let fractionDigits = '';
  let hasMark = false;

  for (const char of input) {
    if (isDigit(char)) {
      if (hasMark) fractionDigits += char;
      else integerDigits += char;
    } else if (!hasMark && allowDecimal && isDecimalMark(char)) {
      hasMark = true;
    }
  }

  // A number mask that renders `007` is not rendering a number, so leading zeros
  // go unconditionally rather than behind cleave's `stripLeadingZeroes` flag — a
  // code that keeps them is an L1 `blocks` mask, not this one.
  let integer = integerDigits.replace(/^0+/, '');
  if (!integer && (integerDigits || hasMark)) integer = '0';

  const { numberIntegerScale } = options;
  if (numberIntegerScale !== undefined && numberIntegerScale >= 0) {
    integer = integer.slice(0, numberIntegerScale);
  }
  const fraction = fractionDigits.slice(0, decimalScale);

  const sign = negative ? '-' : '';
  // Rendered even with no digits yet: a typed `-` that displays nothing reads as
  // a dropped keystroke.
  const tail = hasMark ? decimalMark + fraction : '';

  const completed = integer.length > 0;

  return {
    value: sign + groupDigits(integer, config.primaryGroup, config.secondaryGroup, group) + tail,
    // Group separators removed, decimal mark and sign kept — those are part of
    // the number, not punctuation between its blocks. `iso` is the form to
    // hand to `Number()`.
    raw: sign + integer + tail,
    completed,
    ...(completed ? { iso: `${sign}${integer}${fraction ? `.${fraction}` : ''}` } : {}),
  };
};

/**
 * Builds the `number` mask.
 *
 * `<Input.Field mask={{ number: true }} />` is shorthand for this; call it
 * directly to wrap or compose the behaviour.
 *
 * The caret needs no override. Anchor counting handles every mid-string edit,
 * and the two cases it cannot see — a stripped leading zero and an inserted
 * decimal mark — both land at the end of the value, where `useMask` anchors to
 * the end anyway.
 *
 * @param options - Locale, separators and the integer / fraction scales.
 *
 * @example
 * ```tsx
 * // The v1 `numeral` demo: 1.234.567,89
 * const amount = createNumberMask({ number: true, numberLocale: 'tr-TR' });
 * <Input.Field mask={amount} onValueChange={(_, meta) => save(Number(meta.iso))} />
 * ```
 */
export const createNumberMask = (options: MaskNumberOptions): MaskResolver => {
  const resolver: MaskResolver = (raw) => format(raw, options);
  if (options.backspace !== undefined) resolver.backspace = options.backspace;
  return resolver;
};
