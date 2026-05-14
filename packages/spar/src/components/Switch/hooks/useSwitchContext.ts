import { createContext, useContext } from 'react';
import type { SwitchContextValue, SwitchInternalContextValue } from '../types';

export const SwitchContext = createContext<SwitchInternalContextValue | null>(null);

export const useSwitchContext = (): SwitchContextValue => {
  const context = useContext(SwitchContext);
  if (!context) {
    throw new Error('Switch compound components must be used within Switch.Root');
  }
  return context;
};

export const useSwitchInternalContext = (): SwitchInternalContextValue => {
  const context = useContext(SwitchContext);
  if (!context) {
    throw new Error('Switch compound components must be used within Switch.Root');
  }
  return context;
};
