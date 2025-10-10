import { createElement, useState } from 'react';
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
  const [itemCount, setItemCount] = useState<number>(0);
  const [registeredItems] = useState<Set<string>>(() => new Set());

  const handleRegisterItem = (id: string) => {
    registeredItems.add(id);
    setItemCount(registeredItems.size);
  };

  const handleUnregisterItem = (id: string) => {
    registeredItems.delete(id);
    setItemCount(registeredItems.size);
  };

  const contextValue: BreadcrumbContextValue = {
    ...(isDisabled !== undefined && { isDisabled }),
    ...(onNavigate && { onNavigate }),
    registerItem: handleRegisterItem,
    unregisterItem: handleUnregisterItem,
    itemCount,
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {createElement(
        as,
        {
          ...props,
          'aria-label': ariaLabel,
          'aria-disabled': isDisabled || undefined,
          'data-glide-breadcrumb-root': '',
          'data-disabled': isDisabled || undefined,
        },
        children,
      )}
    </BreadcrumbContext.Provider>
  );
};

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
