import type { Placement } from '@floating-ui/react-dom';
import type { PopoverSide, PopoverAlign } from '../types';

/**
 * Utility function to convert side + align to Floating UI placement
 */
export const getPlacement = (side: PopoverSide, align: PopoverAlign): Placement => {
  if (align === 'center') {
    return side as Placement;
  }
  return `${side}-${align}` as Placement;
};

/**
 * Utility function to get focusable elements
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};
