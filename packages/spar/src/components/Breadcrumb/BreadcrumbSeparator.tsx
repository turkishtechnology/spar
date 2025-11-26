import { createElement } from 'react';
import type { BreadcrumbSeparatorProps } from './types';

/**
 * Visual separator between breadcrumb items. Hidden from screen readers to avoid verbose announcements.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbSeparator = ({
  as = 'li',
  children,
  'aria-hidden': ariaHidden = true,
  ...props
}: BreadcrumbSeparatorProps) => {
  return createElement(
    as,
    {
      ...props,
      'aria-hidden': ariaHidden,
      'data-spar-breadcrumb-separator': '',
    },
    children,
  );
};

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
