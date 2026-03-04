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
import type { PopoverProps, PopoverState } from '../types';
import type { Side, Align } from '../../../types';
import { getPlacement } from '../utils';

/**
 * Custom hook for popover state management with Floating UI
 */
export const usePopover = (props: Omit<PopoverProps, 'children'>) => {
  const {
    id: providedId,
    open: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    modal = false,
    disabled = false,
    side = 'bottom',
    align = 'center',
    sideOffset = 8,
  } = props;

  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const contentId = `${baseId}-content`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const arrowRef = useRef<HTMLDivElement | null>(null);

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

  const [mounted, setMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setMounted(true);
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
    contentId,
  });

  // Update state when open changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  // Update actual placement in state
  useEffect(() => {
    if (actualPlacement) {
      const [actualSide, actualAlign] = actualPlacement.split('-') as [Side, Align | undefined];
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
    arrowRef,
    floatingStyles,
    modal,
    disabled,
    side,
    align,
    sideOffset,
    openPopover,
    closePopover,
    togglePopover,
    onOpenChange,
    mounted,
  };
};
