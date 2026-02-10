import type { ElementType } from 'react';
import type { DropdownMenuGroupProps } from './types';

/**
 * Groups related menu items together with a `group` role for semantic structure.
 */
export const DropdownMenuGroup = <T extends ElementType = 'div'>({
  as,
  ...props
}: DropdownMenuGroupProps<T>) => {
  const Component = as || 'div';
  return <Component {...props} role='group' />;
};

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
