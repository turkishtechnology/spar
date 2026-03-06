import { createContext, useContext, type CSSProperties } from 'react';
import type { Side, Align } from '../../../types';

export interface DropdownMenuContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
  /** Actual computed placement side of the content. */
  side: Side;
  /** Actual computed placement alignment of the content. */
  align: Align;
}

export const DropdownMenuContentContext = createContext<DropdownMenuContentContextValue | null>(
  null,
);

/**
 * Hook to access dropdown menu content context.
 * Must be used within DropdownMenuContent.
 */
export const useDropdownMenuContentContext = () => {
  const context = useContext(DropdownMenuContentContext);
  if (!context) {
    throw new Error('DropdownMenuArrow must be used within DropdownMenuContent');
  }
  return context;
};
