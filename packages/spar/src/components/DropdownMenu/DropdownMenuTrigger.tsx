import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  type Ref,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import type { DropdownMenuTriggerProps, DropdownMenuFocusStrategy } from './types';
import { useDropdownMenuRootContext } from './contexts';
import { composeRefs } from './utils';

export const DropdownMenuTrigger = ({
  as: Component = 'button',
  asChild = false,
  disabled = false,
  onClick,
  onKeyDown,
  ref,
  children,
  ...props
}: DropdownMenuTriggerProps) => {
  const menu = useDropdownMenuRootContext();
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
    (event: ReactMouseEvent<HTMLElement>) => {
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
    (event: ReactKeyboardEvent<HTMLElement>) => {
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

  const isNativeButton = Component === 'button';

  const commonProps = {
    ...props,
    id: menu.triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': menu.open,
    'aria-controls': menu.open ? menu.contentId : undefined,
    'data-state': menu.open ? 'open' : 'closed',
    ...(disabled ? { 'data-disabled': '' } : {}),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  if (asChild) {
    const onlyChild = Children.only(children);
    if (!isValidElement(onlyChild)) {
      throw new Error('DropdownMenuTrigger with asChild expects a single React element child');
    }
    const childType = (onlyChild as ReactElement).type;
    let isButton = false;
    if (typeof childType === 'string') {
      isButton = childType.toLowerCase() === 'button';
    }
    const childRef = (onlyChild as { ref?: Ref<HTMLElement | null> }).ref;
    return cloneElement<Record<string, unknown> & { ref?: Ref<HTMLElement | null> }>(
      onlyChild as ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement | null> }>,
      {
        ...commonProps,
        ...(isButton ? { disabled } : disabled ? { 'aria-disabled': true } : {}),
        ref: composeRefs<HTMLElement | null>(childRef, triggerRefCallback),
      },
    );
  }

  return (
    <Component
      {...commonProps}
      ref={triggerRefCallback}
      role={isNativeButton ? undefined : 'button'}
      tabIndex={isNativeButton ? commonProps.tabIndex : disabled ? -1 : (commonProps.tabIndex ?? 0)}
      disabled={isNativeButton ? disabled : undefined}
      {...(!isNativeButton && disabled ? { 'aria-disabled': true } : {})}
    >
      {children}
    </Component>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
