import { createContext, useContext } from 'react';
import type { DropdownMenuContextValue } from '../types';

export const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

export const useDropdownMenuRootContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenuRoot');
  }
  return context;
};
