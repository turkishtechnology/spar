import { useCallback, useMemo } from 'react';
import { PopoverTriggerProps, PopoverTriggerRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { Button } from '../Button';

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = ({
  as = 'button',
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

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!state.isOpen) {
            openPopover();
          }
          break;
      }
      onKeyDown?.(event);
    },
    [disabled, state.isOpen, openPopover, onKeyDown],
  );

  const triggerRefCallback = useMemo(
    () => (element: HTMLElement | null) => {
      if (triggerRef && 'current' in triggerRef) {
        triggerRef.current = element;
      }
      if (typeof ref === 'function') {
        ref(element as HTMLButtonElement | null);
      } else if (ref) {
        ref.current = element as HTMLButtonElement | null;
      }
    },
    [triggerRef, ref],
  );

  // Render props for children function
  const renderProps: PopoverTriggerRenderProps = {
    isOpen: state.isOpen,
    disabled,
    open: openPopover,
    close: closePopover,
    toggle: togglePopover,
  };

  return (
    <Button
      as={as}
      disabled={disabled}
      ref={triggerRefCallback}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? state.contentId : undefined}
      aria-haspopup='dialog'
      data-state={state.isOpen ? 'open' : 'closed'}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';
