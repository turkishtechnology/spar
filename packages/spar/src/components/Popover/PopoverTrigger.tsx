import { cloneElement, isValidElement, useCallback, useMemo } from 'react';
import { PopoverTriggerProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = ({
  asChild = false,
  children,
  disabled: disabledProp,
  onClick,
  onKeyDown,
  ref,
  ...props
}: PopoverTriggerProps) => {
  const {
    state,
    triggerRef,
    togglePopover,
    openPopover,
    disabled: contextDisabled,
  } = usePopoverContext();

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? contextDisabled;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      event.preventDefault();
      togglePopover();
      onClick?.(event);
    },
    [disabled, togglePopover, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          togglePopover();
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!state.isOpen) {
            openPopover();
          }
          break;
      }
      onKeyDown?.(event);
    },
    [disabled, state.isOpen, togglePopover, openPopover, onKeyDown],
  );

  const triggerProps = useMemo(
    () => ({
      ref: (element: HTMLButtonElement | null) => {
        if (triggerRef && 'current' in triggerRef) {
          triggerRef.current = element;
        }
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-expanded': state.isOpen,
      'aria-controls': state.isOpen ? state.contentId : undefined,
      'aria-haspopup': 'dialog' as const,
      'data-state': state.isOpen ? 'open' : 'closed',
      'data-disabled': disabled ? '' : undefined,
      ...props,
    }),
    [handleClick, handleKeyDown, state.isOpen, state.contentId, disabled, props, triggerRef, ref],
  );

  if (asChild && isValidElement(children)) {
    const childType = (children as React.ReactElement).type;
    let isButton = false;
    if (typeof childType === 'string') {
      isButton = childType.toLowerCase() === 'button';
    }
    const asChildProps = {
      ...triggerProps,
      ...(isButton ? { disabled } : disabled ? { 'aria-disabled': true } : {}),
      tabIndex: disabled ? -1 : 0,
    };
    return cloneElement(children, asChildProps);
  }

  return (
    <button type='button' disabled={disabled} {...triggerProps}>
      {children}
    </button>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';
