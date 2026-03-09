import { type Placement } from '@floating-ui/react-dom';
import type { Side, Align } from '../types';
/**
 * Convert side and align to Floating UI placement.
 */
export const getPlacement = (side: Side, align: Align): Placement => {
  if (align === 'center') {
    return side as Placement;
  }
  return `${side}-${align}` as Placement;
};
