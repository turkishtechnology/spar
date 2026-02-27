import { createContext, useContext } from 'react';
import type { DropdownMenuCollectionItem, DropdownMenuCollectionContextValue } from '../types';

export const DropdownMenuCollectionContext =
  createContext<DropdownMenuCollectionContextValue | null>(null);

export const useDropdownMenuCollectionContext = () => {
  const context = useContext(DropdownMenuCollectionContext);
  if (!context) {
    throw new Error('DropdownMenu items must be rendered within DropdownMenuContent');
  }
  return context;
};

export type { DropdownMenuCollectionItem, DropdownMenuCollectionContextValue };
