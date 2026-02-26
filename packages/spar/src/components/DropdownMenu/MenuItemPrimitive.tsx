import {
  useId,
  useLayoutEffect,
  useRef,
  type ElementType,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { DropdownMenuItemProps } from './types';
import { useDropdownMenuCollectionContext } from './hooks';
import { useMergedRef } from '@/hooks';

type MenuItemPrimitiveProps<T extends ElementType = 'div'> = DropdownMenuItemProps<T> & {
  role: string;
  onSelectImpl?: (
    event: React.MouseEvent<HTMLDivElement> | ReactKeyboardEvent<HTMLDivElement>,
  ) => void;
};

/**
 * @internal Shared primitive that handles common menu item behavior including
 * highlight tracking, keyboard/pointer interaction, typeahead registration, and selection.
 */
export const MenuItemPrimitive = <T extends ElementType = 'div'>({
  as,
  role,
  onSelect,
  onSelectImpl,
  disabled = false,
  textValue,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onClick,
  onKeyDown,
  ref,
  id: idProp,
  ...props
}: MenuItemPrimitiveProps<T>) => {
  const Component = as || 'div';
  const collection = useDropdownMenuCollectionContext();
  const fallbackId = useId();
  const itemId = idProp ?? fallbackId;
  const itemRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(itemRef, ref);

  useLayoutEffect(() => {
    const node = itemRef.current;
    const text = textValue ?? node?.textContent?.trim() ?? '';
    collection.registerItem({
      id: itemId,
      ref: itemRef,
      disabled,
      textValue: text,
    });

    return () => {
      collection.unregisterItem(itemId);
    };
  }, [itemId, disabled, textValue, collection.registerItem, collection.unregisterItem]);

  const isHighlighted = collection.isItemHighlighted(itemId);

  const shouldCloseMenu = () => {
    return collection.closeOnSelect;
  };

  const runSelection = (
    event: ReactMouseEvent<HTMLDivElement> | ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (disabled) {
      return;
    }

    onSelect?.(event);
    if (event.defaultPrevented) {
      return;
    }

    onSelectImpl?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (shouldCloseMenu()) {
      collection.closeMenu();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!disabled && !isHighlighted) {
      collection.highlightItem(itemId);
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
  };

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!disabled) {
      collection.highlightItem(itemId);
    }
    onFocus?.(event);
  };

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    runSelection(event);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      runSelection(event);
    }
  };

  return (
    <Component
      {...props}
      id={itemId}
      ref={mergedRef}
      role={role}
      tabIndex={disabled ? -1 : isHighlighted ? 0 : -1}
      aria-disabled={disabled || undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      {...(disabled ? { 'data-disabled': '' } : {})}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
};

MenuItemPrimitive.displayName = 'MenuItemPrimitive';
