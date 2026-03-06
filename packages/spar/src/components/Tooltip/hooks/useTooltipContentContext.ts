import { createContext, useContext, type CSSProperties } from 'react';
import type { Side, Align } from '../../../types';

export interface TooltipContentContextValue {
  /** Ready-to-use styles for the arrow element, computed by useFloating. */
  arrowStyles: CSSProperties;
  /** Actual computed placement side of the content. */
  side: Side;
  /** Actual computed placement alignment of the content. */
  align: Align;
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
