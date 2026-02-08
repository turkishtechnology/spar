import { createContext, useContext } from 'react';
import type { CollapsibleContextValue } from '../types';

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible');
  }
  return context;
};
