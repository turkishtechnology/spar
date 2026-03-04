import type { Placement } from '@floating-ui/react-dom';

import type { Align, Side } from '../types';

/**
 * Converts a side and alignment pair into a Floating UI placement string.
 *
 * Used by positioned components (Tooltip, Popover, Select, DropdownMenu)
 * to translate the headless side/align API to `@floating-ui/react-dom` placement.
 *
 * @param side - The preferred side relative to the reference element.
 * @param align - The alignment along the side axis.
 * @returns A valid Floating UI {@link Placement} value.
 *
 * @example
 * ```ts
 * getPlacement('bottom', 'start'); // 'bottom-start'
 * getPlacement('top', 'center');   // 'top'
 * getPlacement('left');            // 'left'
 * ```
 */
export const getPlacement = (side: Side, align: Align = 'center'): Placement => {
  if (align === 'center') {
    return side;
  }

  return `${side}-${align}` as Placement;
};
