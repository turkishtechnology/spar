import { createContext, useContext } from 'react';
import type { SelectGroupContextValue } from '../types';

export const SelectGroupContext = createContext<SelectGroupContextValue | null>(null);

export const useSelectGroupContext = () => {
  const context = useContext(SelectGroupContext);
  if (!context) {
    throw new Error('SelectGroup components must be used within a SelectGroup');
  }
  return context;
};
