import type { ElementType } from 'react';
import type { BreadcrumbPageProps } from './types';

/**
 * Current page indicator (non-interactive). Marks the current location in the breadcrumb trail.
 */
export const BreadcrumbPage = <T extends ElementType = 'span'>({
  as,
  children,
  ...props
}: BreadcrumbPageProps<T>) => {
  const Component = as || 'span';

  return (
    <Component {...props} aria-current='page' data-current={''}>
      {children}
    </Component>
  );
};

BreadcrumbPage.displayName = 'BreadcrumbPage';
