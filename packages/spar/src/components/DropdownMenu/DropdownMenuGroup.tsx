import type { ElementType } from 'react';
import type { DropdownMenuGroupProps } from './types';

export const DropdownMenuGroup = <T extends ElementType = 'div'>({
  as,
  ...props
}: DropdownMenuGroupProps<T>) => {
  const Component = as || 'div';
  return <Component {...props} role='group' />;
};

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
