import {
  Children,
  cloneElement,
  isValidElement,
  Fragment,
  type ReactElement,
  type ReactNode,
  type ElementType,
} from 'react';
import type { BreadcrumbListProps, BreadcrumbItemProps, BreadcrumbPosition } from './types';

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

  const isSeparatorOrFragment = (child: ReactNode): boolean => {
    if (!isValidElement(child)) return false;
    const childType = child.type as { displayName?: string };
    return child.type === Fragment || childType.displayName === 'BreadcrumbSeparator';
  };

  const items = Children.toArray(children).filter((child) => !isSeparatorOrFragment(child));
  const itemCount = items.length;
  let itemIndex = 0;

  return (
    <Component {...props}>
      {Children.map(children, (child) => {
        if (isValidElement(child) && !isSeparatorOrFragment(child)) {
          const currentItemIndex = itemIndex++;

          const position: BreadcrumbPosition =
            currentItemIndex === 0
              ? 'first'
              : currentItemIndex === itemCount - 1
                ? 'last'
                : 'middle';

          return cloneElement(child as ReactElement<BreadcrumbItemProps>, {
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
