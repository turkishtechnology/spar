import { createContext, useContext, type CSSProperties } from 'react';

export interface PopoverContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
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
