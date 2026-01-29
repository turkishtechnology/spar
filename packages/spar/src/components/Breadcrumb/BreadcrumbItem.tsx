import { createElement, ElementType } from 'react';
import type { BreadcrumbItemProps } from './types';

/**
 * List item wrapper for breadcrumb content. Receives position from parent BreadcrumbList.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbItem = <T extends ElementType = 'li'>({
  as,
  children,
  position = 'middle',
  isCurrent = false,
  ...domProps
}: BreadcrumbItemProps<T>) => {
  const Component = as || 'li';

  return createElement(
    Component,
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
