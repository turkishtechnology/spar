import { useMemo, type ElementType } from 'react';
import { BreadcrumbContext } from './hooks';
import type { BreadcrumbProps, BreadcrumbContextValue } from './types';

/**
 * Root navigation container for breadcrumb trail. Provides navigation landmark and manages shared state.
 */
export const Breadcrumb = <T extends ElementType = 'nav'>({
  as,
  children,
  'aria-label': ariaLabel = 'Breadcrumb',
  onNavigate,
  disabled = false,
  ...props
}: BreadcrumbProps<T>) => {
  const Component = as || 'nav';
  const contextValue = useMemo<BreadcrumbContextValue>(
    () => ({
      ...(disabled !== undefined && { disabled }),
      ...(onNavigate && { onNavigate }),
    }),
    [disabled, onNavigate],
  );

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <Component
        {...props}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
      >
        {children}
      </Component>
    </BreadcrumbContext.Provider>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
