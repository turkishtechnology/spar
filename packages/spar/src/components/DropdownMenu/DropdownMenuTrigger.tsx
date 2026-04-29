import {
  useCallback,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type {
  DropdownMenuTriggerProps,
  DropdownMenuFocusStrategy,
  DropdownMenuTriggerRenderProps,
} from './types';
import { useDropdownMenuContext } from './hooks';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Trigger button that toggles the dropdown menu open/closed state.
 * Supports keyboard navigation with ArrowDown/ArrowUp to open and focus first/last item.
 */
export const DropdownMenuTrigger = <T extends ElementType = 'button'>({
  as,
  disabled: disabledProp,
  onClick,
  onKeyDown,
  ref,
  children,
  ...props
}: DropdownMenuTriggerProps<T>) => {
  const menu = useDropdownMenuContext();

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? menu.disabled;

  const mergedRef = useMergedRef(menu.triggerRef, ref);

  const handleOpen = useCallback(
    (strategy: DropdownMenuFocusStrategy) => {
      if (disabled) return;
      menu.setFocusStrategy(strategy);
      menu.onOpenChange(true);
    },
    [disabled, menu],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      if (menu.open) {
        menu.closeMenu();
      } else {
        // event.detail === 0 → keyboard-triggered click (Enter/Space)
        // event.detail >= 1 → real pointer click
        handleOpen(event.detail === 0 ? 'first' : 'none');
      }
      onClick?.(event);
    },
    [onClick, disabled, menu, handleOpen],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleOpen('first');
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleOpen('last');
        return;
      }
    },
    [onKeyDown, disabled, handleOpen],
  );

  // Render props for children function
  const renderProps: DropdownMenuTriggerRenderProps = {
    isOpen: menu.open,
    disabled,
    open: useCallback(() => handleOpen('first'), [handleOpen]),
    close: useCallback(() => menu.closeMenu(), [menu]),
    toggle: useCallback(() => {
      if (menu.open) {
        menu.closeMenu();
      } else {
        handleOpen('first');
      }
    }, [menu, handleOpen]),
  };

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    id: menu.triggerId,
    disabled,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': menu.open,
    'aria-controls': menu.contentId,
    'data-state': menu.open ? 'open' : 'closed',
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
