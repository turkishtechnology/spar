import { createContext, useContext } from 'react';
import type { BreadcrumbListContextValue } from '../types';

/**
 * Context for breadcrumb list item registration
 */
export const BreadcrumbListContext = createContext<BreadcrumbListContextValue | null>(null);

/**
 * Hook to access the breadcrumb list context for item registration
 */
export const useBreadcrumbListContext = () => {
  const context = useContext(BreadcrumbListContext);
  if (!context) {
    throw new Error('BreadcrumbItem must be used within a BreadcrumbList');
  }
  return context;
};
