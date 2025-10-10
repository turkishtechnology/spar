import { createContext, useContext } from 'react';
import type { BreadcrumbContextValue } from './types';

/**
 * Context for breadcrumb component communication
 */
export const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

/**
 * Hook to access breadcrumb context
 */
export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  return context || {};
};
