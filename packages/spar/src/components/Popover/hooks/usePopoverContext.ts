import { createContext, useContext } from 'react';
import type { PopoverContextValue } from '../types';

// Context for sharing popover state between components
export const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Hook to access popover context
 */
export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover');
  }
  return context;
};
