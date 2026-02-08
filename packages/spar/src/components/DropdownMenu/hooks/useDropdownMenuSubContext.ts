import { createContext, useContext } from 'react';
import type { DropdownMenuSubContextValue } from '../types';
import { useDropdownMenuRootContext } from './useDropdownMenuContext';

export const DropdownMenuSubContext = createContext<DropdownMenuSubContextValue | null>(null);

export const useDropdownMenuSubContext = () => {
  const context = useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error('DropdownMenuSub components must be used within DropdownMenuSub');
  }
  return context;
};

export const useMenuScope = () => {
  const subContext = useContext(DropdownMenuSubContext);
  if (subContext) {
    return subContext;
  }
  return useDropdownMenuRootContext();
};
