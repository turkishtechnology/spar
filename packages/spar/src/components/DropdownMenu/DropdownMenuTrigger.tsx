import {
  useCallback,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type {
  DropdownMenuTriggerProps,
  DropdownMenuFocusStrategy,
  DropdownMenuTriggerRenderProps,
} from './types';
import { useDropdownMenuRootContext } from './contexts';
import { composeRefs } from './utils';
import { Button } from '../Button';

export const DropdownMenuTrigger = ({
  as = 'button',
  disabled: disabledProp,
  onClick,
  onKeyDown,
  ref,
  children,
  ...props
}: DropdownMenuTriggerProps) => {
  const menu = useDropdownMenuRootContext();

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? menu.disabled;

  const triggerRefCallback = useMemo(
    () => composeRefs<HTMLElement | null>(menu.triggerRef, ref),
    [menu.triggerRef, ref],
  );

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
        onClick?.(event);
        return;
      }

      if (menu.open) {
        menu.closeMenu();
      } else {
        handleOpen('first');
      }
      onClick?.(event);
    },
    [onClick, disabled, menu, handleOpen],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }

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

  return (
    <Button
      as={as}
      ref={triggerRefCallback}
      id={menu.triggerId}
      disabled={disabled}
      aria-haspopup='menu'
      aria-expanded={menu.open}
      aria-controls={menu.open ? menu.contentId : undefined}
      data-state={menu.open ? 'open' : 'closed'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
