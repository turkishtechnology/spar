import type { DropdownMenuItemProps } from './types';
import { MenuItemPrimitive } from './MenuItemPrimitive';

export const DropdownMenuItem = ({
  role: roleProp = 'menuitem',
  ...props
}: DropdownMenuItemProps) => {
  return <MenuItemPrimitive {...props} role={roleProp} itemType='item' closeBehavior='close' />;
};

DropdownMenuItem.displayName = 'DropdownMenuItem';
