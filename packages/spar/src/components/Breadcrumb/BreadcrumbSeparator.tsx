import { createElement, ElementType } from 'react';
import type { BreadcrumbSeparatorProps } from './types';

/**
 * Visual separator between breadcrumb items. Hidden from screen readers to avoid verbose announcements.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbSeparator = <T extends ElementType = 'li'>({
  as,
  children,
  'aria-hidden': ariaHidden = true,
  ...props
}: BreadcrumbSeparatorProps<T>) => {
  const Component = as || 'li';

  return createElement(
    Component,
    {
      ...props,
      'aria-hidden': ariaHidden,
      'data-spar-breadcrumb-separator': '',
    },
    children,
  );
};

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
