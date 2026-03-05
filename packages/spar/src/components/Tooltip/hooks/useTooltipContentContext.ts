import { createContext, useContext, type CSSProperties } from 'react';
import type { Side } from '../../../types';

export interface TooltipContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
  /** Actual computed placement side of the content. */
  side: Side;
}

export const TooltipContentContext = createContext<TooltipContentContextValue | null>(null);

/**
 * Hook to access tooltip content context.
 * Must be used within TooltipContent.
 */
export const useTooltipContentContext = () => {
  const context = useContext(TooltipContentContext);
  if (!context) {
    throw new Error('TooltipArrow must be used within TooltipContent');
  }
  return context;
};
