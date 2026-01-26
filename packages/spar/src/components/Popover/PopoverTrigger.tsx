import { useCallback, useMemo } from 'react';
import { PopoverTriggerProps, PopoverTriggerRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = ({
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

  const triggerRefCallback = useMemo(
    () => (element: HTMLButtonElement | null) => {
      if (triggerRef && 'current' in triggerRef) {
        triggerRef.current = element;
      }
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
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
    <button
      type='button'
      disabled={disabled}
      ref={triggerRefCallback}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? state.contentId : undefined}
      aria-haspopup='dialog'
      data-state={state.isOpen ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </button>
  );
};

PopoverTrigger.displayName = 'PopoverTrigger';
