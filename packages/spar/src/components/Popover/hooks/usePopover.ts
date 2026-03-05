import { useState, useRef, useCallback, useId } from 'react';
import type { PopoverProps } from '../types';

/**
 * Custom hook for popover state management
 */
export const usePopover = (props: Omit<PopoverProps, 'children'>) => {
  const {
    id: providedId,
    open: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    modal = false,
    disabled = false,
  } = props;

  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const contentId = `${baseId}-content`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const arrowRef = useRef<Element | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openPopover = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const closePopover = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const togglePopover = useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, openPopover, closePopover]);

  return {
    isOpen,
    contentId,
    triggerRef,
    contentRef,
    arrowRef,
    modal,
    disabled,
    openPopover,
    closePopover,
    togglePopover,
    onOpenChange,
  };
};
