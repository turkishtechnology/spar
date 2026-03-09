import { useCallback, ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import { PopoverTriggerProps, PopoverTriggerRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = <T extends ElementType = 'button'>({
  as,
  children,
  disabled: disabledProp,
  onClick,
  onKeyDown,
  ref,
  ...props
}: PopoverTriggerProps<T>) => {
  const {
    isOpen,
    contentId,
    triggerRef,
    togglePopover,
    openPopover,
    closePopover,
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

      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            openPopover();
          }
          break;
      }
    },
    [onKeyDown, disabled, isOpen, openPopover],
  );

  const mergedRef = useMergedRef(triggerRef as React.RefObject<HTMLElement | null>, ref);

  // Render props for children function
  const renderProps: PopoverTriggerRenderProps = {
    isOpen,
    disabled,
    open: openPopover,
    close: closePopover,
    toggle: togglePopover,
  };

  const buttonProps = {
    ...(as && { as }),
    disabled,
    ref: mergedRef,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    'aria-haspopup': 'dialog' as const,
    'data-state': isOpen ? 'open' : 'closed',
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';
