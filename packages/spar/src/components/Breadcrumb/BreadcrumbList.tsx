import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type ElementType,
} from 'react';
import type { BreadcrumbListProps, BreadcrumbItemProps, BreadcrumbPosition } from './types';
import { BreadcrumbItem } from './BreadcrumbItem';

/**
 * Ordered list container for breadcrumb items. Provides semantic structure for navigation trail.
 * Calculates and passes position data to child items.
 */
export const BreadcrumbList = <T extends ElementType = 'ol'>({
  as,
  children,
  ...props
}: BreadcrumbListProps<T>) => {
  const Component = as || 'ol';

  const isBreadcrumbItem = (child: ReactNode): child is ReactElement<BreadcrumbItemProps> => {
    if (!isValidElement(child)) return false;
    return child.type === BreadcrumbItem;
  };

  const items = Children.toArray(children).filter(isBreadcrumbItem);
  const itemCount = items.length;
  let itemIndex = 0;

  return (
    <Component {...props}>
      {Children.map(children, (child) => {
        if (isBreadcrumbItem(child)) {
          const currentItemIndex = itemIndex++;

          const position: BreadcrumbPosition =
            currentItemIndex === 0
              ? 'first'
              : currentItemIndex === itemCount - 1
                ? 'last'
                : 'middle';

          return cloneElement(child, {
            position,
            isCurrent: currentItemIndex === itemCount - 1,
          });
        }
        return child;
      })}
    </Component>
  );
};

BreadcrumbList.displayName = 'BreadcrumbList';
