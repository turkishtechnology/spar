import { cloneElement, isValidElement, useCallback } from 'react';
import { PopoverTriggerProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = ({
  asChild = false,
  children,
  isDisabled = false,
  onClick,
  onKeyDown,
  ref,
  ...props
}: PopoverTriggerProps) => {
  const { state, triggerRef, togglePopover, openPopover } = usePopoverContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;

      event.preventDefault();
      togglePopover();
      onClick?.(event);
    },
    [isDisabled, togglePopover, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isDisabled) return;

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
    [isDisabled, state.isOpen, togglePopover, openPopover, onKeyDown],
  );

  const triggerProps = {
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
    disabled: isDisabled,
    'data-state': state.isOpen ? 'open' : 'closed',
    'data-disabled': isDisabled ? '' : undefined,
    ...props,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, triggerProps);
  }

  return (
    <button type='button' {...triggerProps}>
      {children}
    </button>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';
