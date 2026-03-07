import { createContext, useContext } from 'react';
import type { SelectCollectionContextValue } from '../types';

export const SelectCollectionContext = createContext<SelectCollectionContextValue | null>(null);

export const useSelectCollectionContext = () => {
  const context = useContext(SelectCollectionContext);
  if (!context) {
    throw new Error('Select items must be rendered within SelectContent');
  }
  return context;
};
