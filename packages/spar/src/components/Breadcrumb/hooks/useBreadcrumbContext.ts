import { createContext, useContext } from 'react';
import type { BreadcrumbContextValue } from '../types';

/**
 * Context for breadcrumb component communication
 */
export const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

/**
 * Hook to access breadcrumb context
 */
export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('Breadcrumb components must be used within a Breadcrumb');
  }
  return context;
};
