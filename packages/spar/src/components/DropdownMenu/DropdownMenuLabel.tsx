import type { ElementType } from 'react';
import type { DropdownMenuLabelProps } from './types';

/**
 * A non-interactive label used to describe a group of menu items.
 */
export const DropdownMenuLabel = <T extends ElementType = 'div'>({
  as,
  ...props
}: DropdownMenuLabelProps<T>) => {
  const Component = as || 'div';
  return <Component {...props} />;
};

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
