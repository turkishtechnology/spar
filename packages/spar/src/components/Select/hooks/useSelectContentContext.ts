import { createContext, useContext, type CSSProperties } from 'react';
import type { Side, Align } from '../../../types';

export interface SelectContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
  /** Actual computed placement side of the content. */
  side: Side;
  /** Actual computed placement alignment of the content. */
  align: Align;
}

export const SelectContentContext = createContext<SelectContentContextValue | null>(null);

/**
 * Hook to access select content context.
 * Must be used within SelectContent.
 */
export const useSelectContentContext = () => {
  const context = useContext(SelectContentContext);
  if (!context) {
    throw new Error('SelectArrow must be used within SelectContent');
  }
  return context;
};
