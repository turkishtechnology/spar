import { createElement } from 'react';
import type { BreadcrumbPageProps } from './types';

/**
 * Current page indicator (non-interactive). Marks the current location in the breadcrumb trail.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbPage = ({ as = 'span', children, ...props }: BreadcrumbPageProps) => {
  return createElement(
    as,
    {
      ...props,
      'aria-current': 'page',
      'data-glide-breadcrumb-page': '',
      'data-current': 'true',
    },
    children,
  );
};

BreadcrumbPage.displayName = 'BreadcrumbPage';
