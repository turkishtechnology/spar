import type { ElementType } from 'react';
import type { DropdownMenuSeparatorProps } from './types';

/**
 * A visual separator between groups of menu items.
 * Renders with `separator` role.
 */
export const DropdownMenuSeparator = <T extends ElementType = 'div'>({
  as,
  ...props
}: DropdownMenuSeparatorProps<T>) => {
  const Component = as || 'div';
  return <Component {...props} role='separator' data-orientation='horizontal' />;
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
