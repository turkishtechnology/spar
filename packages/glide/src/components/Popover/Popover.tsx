import React from 'react';
import type { PopoverRootProps, PopoverContextValue } from './types';
import { PopoverContext } from './hooks/usePopoverContext';
import { usePopover } from './hooks/usePopover';

/**
 * Root container component that provides context for popover state
 */
export const PopoverRoot = ({ children, ...props }: PopoverRootProps) => {
  const popoverState = usePopover(props);

  const contextValue: PopoverContextValue = {
    state: popoverState.state,
    triggerRef: popoverState.triggerRef as React.RefObject<HTMLElement | null>,
    contentRef: popoverState.contentRef as React.RefObject<HTMLDivElement | null>,
    anchorRef: popoverState.anchorRef,
    arrowRef: popoverState.arrowRef,
    floatingStyles: popoverState.floatingStyles,
    modal: popoverState.modal,
    side: popoverState.side,
    align: popoverState.align,
    sideOffset: popoverState.sideOffset,
    openPopover: popoverState.openPopover,
    closePopover: popoverState.closePopover,
    togglePopover: popoverState.togglePopover,
    ...(popoverState.onOpenChange && { onOpenChange: popoverState.onOpenChange }),
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      <div data-state={popoverState.state.isOpen ? 'open' : 'closed'}>{children}</div>
    </PopoverContext.Provider>
  );
};

PopoverRoot.displayName = 'PopoverRoot';
