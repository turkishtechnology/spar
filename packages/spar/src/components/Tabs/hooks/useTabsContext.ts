import { createContext, useContext } from 'react';
import type { TabsContextValue } from '../types';

export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Hook to access Tabs context. Must be used within a Tabs component.
 *
 * @returns TabsContextValue containing state and methods for tab management
 * @throws Error if used outside of Tabs context
 */
export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs');
  }
  return context;
};
