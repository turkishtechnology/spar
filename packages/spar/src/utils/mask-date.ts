/**
 * The `date` mask, as a {@link MaskResolver}.
 *
 * This is not an engine branch. It is a resolver written against the same public
 * contract userland gets, which is the point: date is the hardest mask Spar
 * ships — per-block clamping while typing, month length, leap years, an
 * inclusive range and a canonical ISO value — and it needs nothing the contract
 * does not already give you.
 *
 * Ported from `cleave.js@1.6.0` (`shortcuts/DateFormatter.js`) with the
 * corrections marked DEVIATION below. Takeoff Core still runs the uncorrected
 * version, so v1 and v2 differ at exactly these points, by intent.
 */

import type { MaskDateOptions, MaskDateToken, MaskResolver, MaskResolverResult } from '@/types';
import {
  capacityOf,
  distribute,
  getGapDelimiters,
  pad2,
  pad4,
  splitIntoParts,
  toDigits,
} from './mask-shared';

const BLOCK_SIZE: Record<MaskDateToken, number> = { d: 2, m: 2, y: 2, Y: 4 };

const DEFAULT_PATTERN: readonly MaskDateToken[] = ['d', 'm', 'Y'];

/** Block sizes implied by a date pattern's tokens. */
export const dateBlocks = (tokens: readonly MaskDateToken[] = DEFAULT_PATTERN): number[] =>
  tokens.map((token) => BLOCK_SIZE[token]);

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** Per-block clamp applied while typing, before the value is complete. */
const clampParts = (
  digits: string,
  tokens: readonly MaskDateToken[],
  blocks: readonly number[],
): string => {
  let rest = digits;
  let result = '';

  tokens.forEach((token, index) => {
    if (!rest.length) return;

    const size = blocks[index] ?? 2;
    let block = rest.slice(0, size);
    const first = block.slice(0, 1);
    rest = rest.slice(size);

    if (token === 'd') {
      if (block === '00') block = '01';
      else if (Number(first) > 3) block = `0${first}`;
      else if (Number(block) > 31) block = '31';
    } else if (token === 'm') {
      if (block === '00') block = '01';
      else if (Number(first) > 1) block = `0${first}`;
      else if (Number(block) > 12) block = '12';
    }

    result += block;
  });

  return result;
};

/**
 * Clamps a day to the length of its month, once both are known.
 *
 * A pattern with no `m` token has no month to measure against and reports 0.
 * There is nothing to clamp to then, so the day keeps its own bound — otherwise
 * month 0 falls into the 30-day branch and `['d', 'Y']` rewrites `31/2025`.
 */
const clampDayToMonth = (day: number, month: number, year: number): number => {
  let result = Math.min(day, 31);
  if (month < 1) return result;

  const monthLength = Math.min(month, 12);

  if ((monthLength < 7 && monthLength % 2 === 0) || (monthLength > 8 && monthLength % 2 === 1)) {
    result = Math.min(result, monthLength === 2 ? (isLeapYear(year) ? 29 : 28) : 30);
  }

  return result;
};

/**
 * Parses an ISO `YYYY-MM-DD` bound into a comparable `[year, month, day]`.
 *
 * DEVIATION 6 — `DateFormatter` requires `dateMin`/`dateMax` to be non-null
 * strings and calls `.split()` on them unconditionally. This accepts `undefined`
 * and reports "no bound" instead of throwing.
 */
const parseBound = (bound: string | undefined): [number, number, number] | null => {
  if (!bound) return null;

  const parts = bound.split('-').map((part) => Number.parseInt(part, 10));
  const [year, month, day] = parts;

  if (parts.length !== 3 || year === undefined || month === undefined || day === undefined) {
    return null;
  }
  if ([year, month, day].some((part) => Number.isNaN(part))) return null;

  return [year, month, day];
};

const compareDate = (a: [number, number, number], b: [number, number, number]): number =>
  a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

const format = (input: string, options: MaskDateOptions): MaskResolverResult => {
  const tokens = options.datePattern ?? DEFAULT_PATTERN;
  const blocks = dateBlocks(tokens);
  const delimiters = getGapDelimiters(options, Math.max(0, blocks.length - 1));
  const capacity = capacityOf(blocks);

  let raw = clampParts(toDigits(input, delimiters, capacity), tokens, blocks).slice(0, capacity);
  let iso: string | undefined;

  // The full-value corrections (month length, leap year, min/max) only make
  // sense once every block is filled; while typing, the per-block clamp above is
  // the whole story. This is also why a range is ignored until the year exists.
  if (raw.length === capacity) {
    const parts = splitIntoParts(raw, blocks);
    const valueOf = (token: MaskDateToken): number => {
      const index = tokens.indexOf(token);
      return index === -1 ? 0 : Number(parts[index] ?? '0');
    };

    const hasFullYear = tokens.includes('Y');
    let year = hasFullYear ? valueOf('Y') : valueOf('y');
    let month = Math.min(valueOf('m'), 12);
    let day = clampDayToMonth(valueOf('d'), month, year);

    // DEVIATION 5 — cleave compares a two-digit `y` year against a four-digit
    // ISO bound, so every `y` pattern clamps straight to `dateMin`. A two-digit
    // year is not comparable to an ISO bound, so the range is skipped instead.
    if (hasFullYear) {
      const candidate: [number, number, number] = [year, month, day];
      const min = parseBound(options.dateMin);
      const max = parseBound(options.dateMax);

      if (max && compareDate(candidate, max) > 0) [year, month, day] = max;
      else if (min && compareDate(candidate, min) < 0) [year, month, day] = min;
    }

    raw = tokens
      .map((token) => {
        if (token === 'd') return pad2(day);
        if (token === 'm') return pad2(month);
        return token === 'Y' ? pad4(year) : pad2(year % 100);
      })
      .join('');

    // Only a four-digit year yields an unambiguous machine value.
    if (hasFullYear && day > 0 && month > 0) iso = `${pad4(year)}-${pad2(month)}-${pad2(day)}`;
  }

  return {
    value: distribute(raw, blocks, delimiters),
    raw,
    completed: raw.length === capacity && capacity > 0,
    ...(iso ? { iso } : {}),
  };
};

/**
 * Builds the `date` mask.
 *
 * `<Input.Field mask={{ date: true }} />` is shorthand for this; call it directly
 * to wrap or compose the behaviour — a resolver that defers to the date mask and
 * then rejects weekends is an ordinary function.
 *
 * @param options - Pattern tokens, delimiters and an optional inclusive range.
 *
 * @example
 * ```tsx
 * const birthday = createDateMask({ date: true, delimiter: '.', dateMax: '2010-12-31' });
 * <Input.Field mask={birthday} onValueChange={(_, meta) => save(meta.iso)} />
 * ```
 */
export const createDateMask = (options: MaskDateOptions): MaskResolver => {
  const resolver: MaskResolver = (raw) => format(raw, options);
  if (options.backspace !== undefined) resolver.backspace = options.backspace;
  return resolver;
};
