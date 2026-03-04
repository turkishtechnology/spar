import { useState, useRef, useCallback, useEffect, useId } from 'react';
import type { PopoverProps, PopoverState } from '../types';

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

  const [mounted, setMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  const [state, setState] = useState<PopoverState>({
    isOpen,
    triggerRect: null,
    contentRect: null,
    actualSide: 'bottom',
    actualAlign: 'center',
    isPositioned: false,
    triggerElement: null,
    contentElement: null,
    contentId,
  });

  // Update state when open changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  const openPopover = useCallback(() => {
    const newOpen = true;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    setState((prev) => ({ ...prev, isOpen: newOpen }));
  }, [isControlled, onOpenChange]);

  const closePopover = useCallback(() => {
    const newOpen = false;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    setState((prev) => ({ ...prev, isOpen: newOpen }));
  }, [isControlled, onOpenChange]);

  const togglePopover = useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, openPopover, closePopover]);

  return {
    state,
    setState,
    triggerRef,
    contentRef,
    arrowRef,
    modal,
    disabled,
    openPopover,
    closePopover,
    togglePopover,
    onOpenChange,
    mounted,
  };
};
