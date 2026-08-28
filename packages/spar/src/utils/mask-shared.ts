/**
 * String surgery shared by the mask engine and the masks Spar ships.
 *
 * Internal. Pure and dependency-free: no DOM, no React, no caret positions.
 * `createDateMask` and `createTimeMask` reach for these the same way `maskShape`
 * does — a preset gets no privileged helper the engine keeps to itself.
 */

import type { MaskCommonOptions } from '@/types';

/**
 * Resolves one delimiter per gap between blocks. `delimiters` wins over
 * `delimiter`; a short `delimiters` array repeats its last entry, matching
 * cleave.
 */
export const getGapDelimiters = (options: MaskCommonOptions, gapCount: number): string[] => {
  const { delimiters, delimiter } = options;

  if (delimiters?.length) {
    const last = delimiters[delimiters.length - 1] ?? '';
    return Array.from({ length: gapCount }, (_, index) => delimiters[index] ?? last);
  }

  return Array.from({ length: gapCount }, () => delimiter ?? '');
};

/** Removes every delimiter occurrence, so masking an already-masked value is idempotent. */
export const stripDelimiters = (value: string, delimiters: string[]): string => {
  let result = value;
  for (const delimiter of new Set(delimiters.filter(Boolean))) {
    result = result.split(delimiter).join('');
  }
  return result;
};

/** `uppercase` wins when both flags are set. */
export const applyCase = (
  value: string,
  options: { uppercase?: boolean; lowercase?: boolean },
): string => {
  if (options.uppercase) return value.toUpperCase();
  if (options.lowercase) return value.toLowerCase();
  return value;
};

export const applyCharFilter = (
  value: string,
  options: { numericOnly?: boolean; letterOnly?: boolean },
): string => {
  if (options.numericOnly) return value.replace(/[^\d]/g, '');
  if (options.letterOnly) return value.replace(/[^\p{L}]/gu, '');
  return value;
};

/**
 * Lays significant characters into blocks, inserting a gap delimiter only once
 * the preceding block is full **and** characters remain — so `'12'` with blocks
 * `[2, 2]` stays `'12'` while `'123'` becomes `'12/3'`.
 */
export const distribute = (chars: string, blocks: number[], delimiters: string[]): string => {
  let rest = chars;
  let result = '';

  for (let index = 0; index < blocks.length; index += 1) {
    if (!rest.length) break;

    const size = blocks[index] ?? 0;
    const block = rest.slice(0, size);
    rest = rest.slice(size);
    result += block;

    if (rest.length && block.length === size) result += delimiters[index] ?? '';
  }

  return result;
};

export const capacityOf = (blocks: number[]): number =>
  blocks.reduce((total, size) => total + size, 0);

export const pad2 = (value: number): string => (value < 10 ? `0${value}` : `${value}`);

export const pad4 = (value: number): string => `${value}`.padStart(4, '0');

/** Splits a digit string into per-block parts using block sizes. */
export const splitIntoParts = (digits: string, blocks: number[]): string[] => {
  const parts: string[] = [];
  let offset = 0;

  for (const size of blocks) {
    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }

  return parts;
};

/**
 * Digits only, capped at the pattern's capacity — the entry step every
 * digit-shaped mask starts from.
 */
export const toDigits = (input: string, delimiters: string[], capacity: number): string =>
  stripDelimiters(input, delimiters).replace(/[^\d]/g, '').slice(0, capacity);
