import { createContext, useContext } from 'react';
import type { SelectItemContextValue } from '../types';

export const SelectItemContext = createContext<SelectItemContextValue | null>(null);

export const useSelectItemContext = () => {
  const context = useContext(SelectItemContext);
  if (!context) {
    throw new Error('SelectItem components must be used within a SelectItem');
  }
  return context;
};
