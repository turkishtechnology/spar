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
  isDisabled = false,
  ...props
}: BreadcrumbRootProps) => {
  const contextValue: BreadcrumbContextValue = {
    ...(isDisabled !== undefined && { isDisabled }),
    ...(onNavigate && { onNavigate }),
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {createElement(
        as,
        {
          ...props,
          'aria-label': ariaLabel,
          'aria-disabled': isDisabled || undefined,
          'data-spar-breadcrumb-root': '',
          'data-disabled': isDisabled || undefined,
        },
        children,
      )}
    </BreadcrumbContext.Provider>
  );
};

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
