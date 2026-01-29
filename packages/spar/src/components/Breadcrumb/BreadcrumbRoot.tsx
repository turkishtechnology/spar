import { createElement, ElementType } from 'react';
import { BreadcrumbContext } from './BreadcrumbContext';
import type { BreadcrumbRootProps, BreadcrumbContextValue } from './types';

/**
 * Root navigation container for breadcrumb trail. Provides navigation landmark and manages shared state.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbRoot = <T extends ElementType = 'nav'>({
  as,
  children,
  'aria-label': ariaLabel = 'Breadcrumb',
  onNavigate,
  disabled = false,
  ...props
}: BreadcrumbRootProps<T>) => {
  const Component = as || 'nav';
  const contextValue: BreadcrumbContextValue = {
    ...(disabled !== undefined && { disabled }),
    ...(onNavigate && { onNavigate }),
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {createElement(
        Component,
        {
          ...props,
          'aria-label': ariaLabel,
          'aria-disabled': disabled || undefined,
          'data-spar-breadcrumb-root': '',
          'data-disabled': disabled ? '' : undefined,
        },
        children,
      )}
    </BreadcrumbContext.Provider>
  );
};

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
