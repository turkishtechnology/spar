import { createElement } from 'react';
import { BreadcrumbContext } from './BreadcrumbContext';
import type { BreadcrumbRootProps, BreadcrumbContextValue } from './types';

/**
 * Root navigation container for breadcrumb trail. Provides navigation landmark and manages shared state.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbRoot = ({
  as = 'nav',
  children,
  'aria-label': ariaLabel = 'Breadcrumb',
  onNavigate,
  disabled = false,
  ...props
}: BreadcrumbRootProps) => {
  const contextValue: BreadcrumbContextValue = {
    ...(disabled !== undefined && { disabled }),
    ...(onNavigate && { onNavigate }),
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {createElement(
        as,
        {
          ...props,
          'aria-label': ariaLabel,
          'aria-disabled': disabled || undefined,
          'data-spar-breadcrumb-root': '',
          'data-disabled': disabled || undefined,
        },
        children,
      )}
    </BreadcrumbContext.Provider>
  );
};

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
