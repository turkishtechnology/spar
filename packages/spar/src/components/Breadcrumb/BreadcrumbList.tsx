import {
  createElement,
  Children,
  cloneElement,
  isValidElement,
  Fragment,
  type ReactElement,
  ElementType,
} from 'react';
import type { BreadcrumbListProps, BreadcrumbItemProps, BreadcrumbPosition } from './types';

/**
 * Ordered list container for breadcrumb items. Provides semantic structure for navigation trail.
 * Calculates and passes position data to child items.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbList = <T extends ElementType = 'ol'>({
  as,
  children,
  ...props
}: BreadcrumbListProps<T>) => {
  const Component = as || 'ol';
  const childCount = Children.count(children);

  return createElement(
    Component,
    {
      ...props,
      'data-spar-breadcrumb-list': '',
    },
    Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        // Skip Fragments and Separators (identified by displayName) - only pass position props to BreadcrumbItem
        const childType = child.type as { displayName?: string };
        if (child.type === Fragment || childType.displayName === 'BreadcrumbSeparator') {
          return child;
        }

        const position: BreadcrumbPosition =
          index === 0 ? 'first' : index === childCount - 1 ? 'last' : 'middle';

        return cloneElement(child as ReactElement<BreadcrumbItemProps>, {
          position,
          isCurrent: index === childCount - 1,
        });
      }
      return child;
    }),
  );
};

BreadcrumbList.displayName = 'BreadcrumbList';
