import { useState, useRef, useCallback, useEffect, useId, useMemo } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  size,
  hide,
  type Strategy,
} from '@floating-ui/react-dom';
import type { PopoverRootProps, PopoverState, PopoverSide, PopoverAlign } from '../types';
import { getPlacement } from '../utils';

/**
 * Custom hook for popover state management with Floating UI
 */
export const usePopover = (props: Omit<PopoverRootProps, 'children'>) => {
  const {
    isOpen: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    modal = false,
    side = 'bottom',
    align = 'center',
    sideOffset = 8,
  } = props;

  const generatedId = useId();
  const contentId = `popover-content-${generatedId}`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const arrowRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  // Floating UI setup
  const placement = getPlacement(side, align);
  const {
    x,
    y,
    strategy,
    refs,
    update,
    placement: actualPlacement,
  } = useFloating({
    placement,
    open: isOpen,
    middleware: [
      offset(sideOffset),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift({
        padding: 8,
      }),
      arrow({
        element: arrowRef,
      }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
      hide(),
    ],
    strategy: 'absolute' as Strategy,
  });

  const [isMounted, setIsMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-update position
  useEffect(() => {
    if (!isOpen || !refs.reference.current || !refs.floating.current) return;

    const cleanup = autoUpdate(refs.reference.current, refs.floating.current, update);
    return cleanup;
  }, [isOpen, refs.reference, refs.floating, update]);

  const [state, setState] = useState<PopoverState>({
    isOpen,
    triggerRect: null,
    contentRect: null,
    side,
    align,
    actualSide: side,
    actualAlign: align,
    isPositioned: false,
    triggerElement: null,
    contentElement: null,
    anchorElement: null,
    contentId,
  });

  // Update state when open changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  // Update actual placement in state
  useEffect(() => {
    if (actualPlacement) {
      const [actualSide, actualAlign] = actualPlacement.split('-') as [
        PopoverSide,
        PopoverAlign | undefined,
      ];
      setState((prev) => ({
        ...prev,
        actualSide,
        actualAlign: actualAlign || 'center',
      }));
    }
  }, [actualPlacement]);

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

  const floatingStyles = useMemo(
    () => ({
      position: strategy,
      top: y ?? 0,
      left: x ?? 0,
    }),
    [strategy, y, x],
  );

  return {
    state,
    setState,
    triggerRef: refs.reference,
    contentRef: refs.floating,
    anchorRef,
    arrowRef,
    floatingStyles,
    modal,
    side,
    align,
    sideOffset,
    openPopover,
    closePopover,
    togglePopover,
    onOpenChange,
    isMounted,
  };
};
