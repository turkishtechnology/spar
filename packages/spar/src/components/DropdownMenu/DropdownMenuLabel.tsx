import type { DropdownMenuLabelProps } from './types';

export const DropdownMenuLabel = ({ as: Component = 'div', ...props }: DropdownMenuLabelProps) => {
  return <Component {...props} />;
};

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
