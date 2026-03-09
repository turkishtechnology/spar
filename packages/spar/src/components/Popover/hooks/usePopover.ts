import { useRef, useCallback, useId } from 'react';
import { useControlledState } from '@/hooks';
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

  const [isOpen = false, setIsOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange);

  const arrowRef = useRef<Element | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openPopover = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const closePopover = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

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
