import { createContext, useContext, type CSSProperties } from 'react';
import type { Side, Align } from '../../../types';

export interface PopoverContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
  /** Actual computed placement side of the content. */
  side: Side;
  /** Actual computed placement alignment of the content. */
  align: Align;
}

export const PopoverContentContext = createContext<PopoverContentContextValue | null>(null);

/**
 * Hook to access popover content context.
 * Must be used within PopoverContent.
 */
export const usePopoverContentContext = () => {
  const context = useContext(PopoverContentContext);
  if (!context) {
    throw new Error('PopoverArrow must be used within PopoverContent');
  }
  return context;
};
