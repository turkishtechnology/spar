import type { DropdownMenuItemProps } from './types';
import { MenuItemPrimitive } from './MenuItemPrimitive';

/**
 * An actionable item within the dropdown menu.
 * Triggers its onSelect callback and closes the menu upon activation.
 */
export const DropdownMenuItem = ({
  role: roleProp = 'menuitem',
  ...props
}: DropdownMenuItemProps) => {
  return <MenuItemPrimitive {...props} role={roleProp} itemType='item' closeBehavior='close' />;
};

DropdownMenuItem.displayName = 'DropdownMenuItem';
