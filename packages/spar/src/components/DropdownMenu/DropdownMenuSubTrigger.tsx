import {
  useCallback,
  useEffect,
  useId,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { DropdownMenuSubTriggerProps } from './types';
import { useDropdownMenuSubContext, useDropdownMenuCollectionContext } from './contexts';
import { MenuItemPrimitive } from './MenuItemPrimitive';
import { getOpenKey, getCloseKey } from './utils';

export const DropdownMenuSubTrigger = ({
  disabled = false,
  onPointerMove,
  onKeyDown,
  onClick,
  ...props
}: DropdownMenuSubTriggerProps) => {
  const subContext = useDropdownMenuSubContext();
  const collection = useDropdownMenuCollectionContext();
  const fallbackId = useId();
  const itemId = props.id ?? fallbackId;

  useEffect(() => {
    if (collection.highlightedId && collection.highlightedId !== itemId && subContext.open) {
      subContext.closeMenu({ focusTrigger: false });
    }
  }, [collection.highlightedId, itemId, subContext.open, subContext.closeMenu]);

  const handleSelectImpl = useCallback(() => {
    if (disabled) {
      return;
    }
    subContext.setFocusStrategy('first');
    subContext.onOpenChange(true);
  }, [disabled, subContext.setFocusStrategy, subContext.onOpenChange]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      subContext.setFocusStrategy('first');
      subContext.onOpenChange(true);
    },
    [onPointerMove, disabled, subContext.setFocusStrategy, subContext.onOpenChange],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (!disabled && event.key === getOpenKey(subContext.dir)) {
        event.preventDefault();
        subContext.setFocusStrategy('first');
        subContext.onOpenChange(true);
        return;
      }

      if (event.key === getCloseKey(subContext.dir) && subContext.open) {
        event.preventDefault();
        subContext.closeMenu();
      }
    },
    [
      onKeyDown,
      disabled,
      subContext.dir,
      subContext.open,
      subContext.setFocusStrategy,
      subContext.onOpenChange,
      subContext.closeMenu,
    ],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      handleSelectImpl();
    },
    [onClick, handleSelectImpl],
  );

  return (
    <MenuItemPrimitive
      {...props}
      id={itemId}
      role='menuitem'
      itemType='subtrigger'
      closeBehavior='persist'
      disabled={disabled}
      onSelectImpl={handleSelectImpl}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      aria-haspopup='menu'
      aria-expanded={subContext.open}
      aria-controls={subContext.open ? subContext.contentId : undefined}
      data-state={subContext.open ? 'open' : 'closed'}
      {...(disabled ? { 'data-disabled': '' } : {})}
    />
  );
};

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';
