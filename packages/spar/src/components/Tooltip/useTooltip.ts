import { useContext } from 'react';
import { TooltipContext } from './TooltipContext';

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within TooltipRoot');
  }
  return context;
};
