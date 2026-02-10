import {
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type { DropdownMenuRadioItemProps } from './types';
import { useDropdownMenuRadioGroupContext } from './hooks';
import { MenuItemPrimitive } from './MenuItemPrimitive';

/**
 * A radio-style menu item that participates in a DropdownMenuRadioGroup.
 * Only one radio item can be selected at a time within the group.
 */
export const DropdownMenuRadioItem = ({ value, ...props }: DropdownMenuRadioItemProps) => {
  const radioGroup = useDropdownMenuRadioGroupContext();
  const checked = radioGroup?.value === value;

  const handleSelectImpl = useCallback(
    (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return;
      }
      radioGroup?.onValueChange?.(value);
    },
    [radioGroup, value],
  );

  return (
    <MenuItemPrimitive
      {...props}
      role='menuitemradio'
      itemType='radio'
      closeBehavior='persist'
      onSelectImpl={handleSelectImpl}
      aria-checked={checked}
      data-checked={checked ? '' : undefined}
    />
  );
};

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';
