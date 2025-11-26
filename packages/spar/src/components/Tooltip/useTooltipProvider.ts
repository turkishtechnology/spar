import { useContext } from 'react';
import { TooltipProviderContext } from './TooltipProviderContext';

export const useTooltipProvider = () => {
  const context = useContext(TooltipProviderContext);
  return context; // Can be null if not within provider
};
