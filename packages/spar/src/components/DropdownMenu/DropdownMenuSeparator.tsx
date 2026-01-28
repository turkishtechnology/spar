import type { ElementType } from 'react';
import type { DropdownMenuSeparatorProps } from './types';

export const DropdownMenuSeparator = <T extends ElementType = 'div'>({
  as,
  ...props
}: DropdownMenuSeparatorProps<T>) => {
  const Component = as || 'div';
  return <Component {...props} role='separator' data-orientation='horizontal' />;
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
