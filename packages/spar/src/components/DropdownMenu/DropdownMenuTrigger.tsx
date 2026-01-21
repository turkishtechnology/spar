import {
  useCallback,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import type {
  DropdownMenuTriggerProps,
  DropdownMenuFocusStrategy,
  DropdownMenuTriggerRenderProps,
} from './types';
import { useDropdownMenuRootContext } from './contexts';
import { composeRefs } from './utils';

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
      onClick?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }

      if (menu.open) {
        menu.closeMenu();
      } else {
        handleOpen('first');
      }
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

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (menu.open) {
          menu.closeMenu();
        } else {
          handleOpen('first');
        }
      }
    },
    [onKeyDown, disabled, handleOpen, menu],
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
    <PrimitiveButton
      as={as}
      type='button'
      disabled={disabled}
      ref={triggerRefCallback}
      id={menu.triggerId}
      aria-haspopup='menu'
      aria-expanded={menu.open}
      aria-controls={menu.open ? menu.contentId : undefined}
      data-state={menu.open ? 'open' : 'closed'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
