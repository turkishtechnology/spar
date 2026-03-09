import { createContext, useContext } from 'react';
import type { TooltipContextValue } from '../types';

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip');
  }
  return context;
};
