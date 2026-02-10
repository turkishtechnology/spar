import {
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type { DropdownMenuCheckboxItemProps } from './types';
import { MenuItemPrimitive } from './MenuItemPrimitive';
import { mapCheckedStateToDataAttribute, mapCheckedStateToAria } from './utils/index';

/**
 * A menu item that can be toggled between checked and unchecked states.
 * Renders with `menuitemcheckbox` role and supports indeterminate state.
 */
export const DropdownMenuCheckboxItem = ({
  checked = false,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  const handleSelectImpl = useCallback(
    (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return;
      }
      const nextChecked = checked === 'indeterminate' ? true : !checked;
      onCheckedChange?.(nextChecked);
    },
    [checked, onCheckedChange],
  );

  return (
    <MenuItemPrimitive
      {...props}
      role='menuitemcheckbox'
      itemType='checkbox'
      closeBehavior='persist'
      onSelectImpl={handleSelectImpl}
      aria-checked={mapCheckedStateToAria(checked)}
      {...mapCheckedStateToDataAttribute(checked)}
    />
  );
};

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
