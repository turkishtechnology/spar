import { useMemo } from 'react';
import type { PopoverProps, PopoverContextValue } from './types';
import { PopoverContext } from './hooks/usePopoverContext';
import { usePopover } from './hooks/usePopover';

/**
 * Root container component that provides context for popover state
 */
export const Popover = ({ children, ...props }: PopoverProps) => {
  const popoverState = usePopover(props);

  const contextValue: PopoverContextValue = useMemo(
    () => ({
      state: popoverState.state,
      triggerRef: popoverState.triggerRef as React.RefObject<HTMLElement | null>,
      contentRef: popoverState.contentRef as React.RefObject<HTMLDivElement | null>,
      arrowRef: popoverState.arrowRef,
      modal: popoverState.modal,
      disabled: popoverState.disabled,
      openPopover: popoverState.openPopover,
      closePopover: popoverState.closePopover,
      togglePopover: popoverState.togglePopover,
      ...(popoverState.onOpenChange && { onOpenChange: popoverState.onOpenChange }),
    }),
    [
      popoverState.state,
      popoverState.triggerRef,
      popoverState.contentRef,
      popoverState.arrowRef,
      popoverState.modal,
      popoverState.disabled,
      popoverState.openPopover,
      popoverState.closePopover,
      popoverState.togglePopover,
      popoverState.onOpenChange,
    ],
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <div data-state={popoverState.state.isOpen ? 'open' : 'closed'}>{children}</div>
    </PopoverContext.Provider>
  );
};

Popover.displayName = 'Popover';
