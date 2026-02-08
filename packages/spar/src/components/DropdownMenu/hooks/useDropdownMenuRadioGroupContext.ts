import { createContext, useContext } from 'react';
import type { DropdownMenuRadioGroupContextValue } from '../types';

export const DropdownMenuRadioGroupContext =
  createContext<DropdownMenuRadioGroupContextValue | null>(null);

export const useDropdownMenuRadioGroupContext = () => {
  const context = useContext(DropdownMenuRadioGroupContext);
  if (!context) {
    throw new Error('DropdownMenuRadioItem must be used within DropdownMenuRadioGroup');
  }
  return context;
};
