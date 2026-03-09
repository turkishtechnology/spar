import type { ElementType } from 'react';
import type { BreadcrumbSeparatorProps } from './types';

/**
 * Visual separator between breadcrumb items. Hidden from screen readers to avoid verbose announcements.
 */
export const BreadcrumbSeparator = <T extends ElementType = 'li'>({
  as,
  children,
  'aria-hidden': ariaHidden = true,
  ...props
}: BreadcrumbSeparatorProps<T>) => {
  const Component = as || 'li';

  return (
    <Component {...props} aria-hidden={ariaHidden}>
      {children}
    </Component>
  );
};

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
