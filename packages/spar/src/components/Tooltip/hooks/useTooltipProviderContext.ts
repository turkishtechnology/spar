import { createContext, useContext } from 'react';
import type { TooltipProviderContextValue } from '../types';

export const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);

export const useTooltipProviderContext = () => {
  const context = useContext(TooltipProviderContext);
  return context; // Can be null if not within provider
};
