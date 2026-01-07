import { createElement } from 'react';
import type { BreadcrumbItemProps } from './types';

/**
 * List item wrapper for breadcrumb content. Receives position from parent BreadcrumbList.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbItem = ({
  as = 'li',
  children,
  position = 'middle',
  isCurrent = false,
  ...domProps
}: BreadcrumbItemProps) => {
  return createElement(
    as,
    {
      ...domProps,
      'data-spar-breadcrumb-item': '',
      'data-position': position,
      'data-current': isCurrent ? '' : undefined,
    },
    children,
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem';
