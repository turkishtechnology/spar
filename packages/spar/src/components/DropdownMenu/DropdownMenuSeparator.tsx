import type { DropdownMenuSeparatorProps } from './types';

export const DropdownMenuSeparator = ({
  as: Component = 'div',
  ...props
}: DropdownMenuSeparatorProps) => {
  return <Component {...props} role='separator' data-orientation='horizontal' />;
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
