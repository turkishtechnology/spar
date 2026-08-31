/**
 * The `time` mask, as a {@link MaskResolver}.
 *
 * Like `./mask-date.ts`, a resolver rather than an engine branch — same public
 * contract as anything you write yourself.
 *
 * Ported from `cleave.js@1.6.0` (`shortcuts/TimeFormatter.js`) with the
 * corrections marked DEVIATION below.
 */

import type { MaskResolver, MaskResolverResult, MaskTimeOptions, MaskTimeToken } from '@/types';
import {
  capacityOf,
  distribute,
  getGapDelimiters,
  pad2,
  splitIntoParts,
  toDigits,
} from './mask-shared';

const DEFAULT_PATTERN: readonly MaskTimeToken[] = ['h', 'm'];

/** DEVIATION 1 — cleave clamps minutes to 60, which is not a minute. */
const MAX_MINUTES = 59;

/** DEVIATION 2 — cleave clamps seconds to 60. */
const MAX_SECONDS = 59;

/** Every time block is two digits wide. */
export const timeBlocks = (tokens: readonly MaskTimeToken[] = DEFAULT_PATTERN): number[] =>
  tokens.map(() => 2);

const format = (input: string, options: MaskTimeOptions): MaskResolverResult => {
  const tokens = options.timePattern ?? DEFAULT_PATTERN;
  const blocks = timeBlocks(tokens);
  const delimiters = getGapDelimiters(options, Math.max(0, blocks.length - 1));
  const capacity = capacityOf(blocks);

  const twelveHour = options.timeFormat === '12';
  const maxHours = twelveHour ? 12 : 23;
  const maxHourFirstDigit = twelveHour ? 1 : 2;

  let rest = toDigits(input, delimiters, capacity);
  let raw = '';

  tokens.forEach((token) => {
    if (!rest.length) return;

    let block = rest.slice(0, 2);
    const first = block.slice(0, 1);
    rest = rest.slice(2);

    if (token === 'h') {
      // DEVIATION 3 — cleave ignores `timeFormat` in this clamp and allows 60.
      // A 12-hour clock runs 01–12, so `00` is an hour it does not have; the
      // 24-hour one keeps it. Same shape as the day/month clamp in `mask-date`.
      if (twelveHour && block === '00') block = '01';
      else if (Number(first) > maxHourFirstDigit) block = `0${first}`;
      else if (Number(block) > maxHours) block = `${maxHours}`;
    } else {
      const limit = token === 's' ? MAX_SECONDS : MAX_MINUTES;
      if (Number(first) > 5) block = `0${first}`;
      else if (Number(block) > limit) block = `${limit}`;
    }

    raw += block;
  });

  raw = raw.slice(0, capacity);
  let iso: string | undefined;

  if (raw.length === capacity) {
    const parts = splitIntoParts(raw, blocks);
    const valueOf = (token: MaskTimeToken): number => {
      const index = tokens.indexOf(token);
      return index === -1 ? 0 : Number(parts[index] ?? '0');
    };

    // DEVIATION 4 — cleave's final pass clamps all three fields with
    // `Math.min(field, 60)`, so 60 minutes and hour 60 survive it.
    const hour = Math.min(valueOf('h'), maxHours);
    const minute = Math.min(valueOf('m'), MAX_MINUTES);
    const second = Math.min(valueOf('s'), MAX_SECONDS);

    raw = tokens
      .map((token) => {
        if (token === 'h') return pad2(hour);
        return pad2(token === 's' ? second : minute);
      })
      .join('');

    iso = tokens.includes('s')
      ? `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
      : `${pad2(hour)}:${pad2(minute)}`;
  }

  return {
    value: distribute(raw, blocks, delimiters),
    raw,
    completed: raw.length === capacity && capacity > 0,
    ...(iso ? { iso } : {}),
  };
};

/**
 * Builds the `time` mask.
 *
 * `<Input.Field mask={{ time: true }} />` is shorthand for this.
 *
 * @param options - Pattern tokens, delimiters and 12- or 24-hour clamping.
 *
 * @example
 * ```tsx
 * const duration = createTimeMask({ time: true, timePattern: ['h', 'm', 's'] });
 * <Input.Field mask={duration} onValueChange={(_, meta) => save(meta.iso)} />
 * ```
 */
export const createTimeMask = (options: MaskTimeOptions): MaskResolver => {
  const resolver: MaskResolver = (raw) => format(raw, options);
  if (options.backspace !== undefined) resolver.backspace = options.backspace;
  return resolver;
};
