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

/**
 * An actionable item within the dropdown menu.
 * Triggers its onSelect callback and closes the menu upon activation.
 */
export const DropdownMenuItem = <T extends ElementType = 'div'>({
  as,
  role: roleProp = 'menuitem',
  onSelect,
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
}: DropdownMenuItemProps<T>) => {
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

    if (collection.closeOnSelect) {
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
      runSelection(event);
      event.preventDefault();
    }
  };

  const ariaAttributes = {
    'aria-disabled': disabled || undefined,
  };

  const dataAttributes = {
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
  };

  const itemProps = {
    ...props,
    id: itemId,
    ref: mergedRef,
    role: roleProp,
    tabIndex: disabled ? -1 : isHighlighted ? 0 : -1,
    ...ariaAttributes,
    ...dataAttributes,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onFocus: handleFocus,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  return <Component {...itemProps} />;
};

DropdownMenuItem.displayName = 'DropdownMenuItem';
