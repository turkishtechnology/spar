import type { DropdownMenuGroupProps } from './types';

export const DropdownMenuGroup = ({ as: Component = 'div', ...props }: DropdownMenuGroupProps) => {
  return <Component {...props} role='group' />;
};

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
