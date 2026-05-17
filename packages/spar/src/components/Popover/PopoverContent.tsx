import { useEffect, useState, useCallback, useMemo, useRef, type ElementType } from 'react';
import { createPortal } from 'react-dom';
import {
  useInteractOutside,
  useMergedRef,
  useFloating,
  useDocumentEvent,
  useFocusTrap,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from '@/hooks';
import { PopoverContentProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { PopoverContentContext } from './hooks/usePopoverContentContext';
import { getFocusableElements } from './utils/index';
import type { Side, Align } from '../../types';

/**
 * Content container that holds the popover content
 */
export const PopoverContent = <T extends ElementType = 'div'>({
  as,
  side = 'bottom',
  align = 'center',
  container,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  trapFocus = false,
  children,
  style,
  onKeyDown,
  ref,
  ...props
}: PopoverContentProps<T>) => {
  const Component = as || 'div';

  const { isOpen, contentId, triggerRef, contentRef, arrowRef, modal, closePopover } =
    usePopoverContext();

  // Use custom Floating UI hook for positioning
  const floatingOptions: UseFloatingOptions = {
    side,
    align,
    arrowRef: arrowRef?.current ?? null,
  };

  const { floatingStyles, arrowStyles, placement, refs }: UseFloatingReturn =
    useFloating(floatingOptions);

  // Set reference element synchronously so floating-ui can compute position
  // on the very first render instead of waiting for an effect.
  if (triggerRef.current) {
    refs.setReference(triggerRef.current);
  }

  const mergedRef = useMergedRef(contentRef, ref);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      mergedRef(node);
      refs.setFloating(node);
    },
    [mergedRef, refs],
  );

  const [mounted, setMounted] = useState(false);

  // Track whether the popover was dismissed by a pointer event (click outside).
  // When dismissed by pointer, we skip focus return because the user intended
  // to interact with another element — returning focus would steal it back.
  const dismissedByPointerRef = useRef(false);

  // Stabilize callback refs so the focus effect doesn't re-run when
  // consumers pass inline functions.
  const onOpenAutoFocusRef = useRef(onOpenAutoFocus);
  onOpenAutoFocusRef.current = onOpenAutoFocus;
  const onCloseAutoFocusRef = useRef(onCloseAutoFocus);
  onCloseAutoFocusRef.current = onCloseAutoFocus;

  // SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    dismissedByPointerRef.current = false;

    const contentElement = contentRef.current;

    // Focus first focusable element when opening
    const focusableElements = getFocusableElements(contentElement);
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus({ preventScroll: true });
    } else {
      contentElement.focus({ preventScroll: true });
    }

    onOpenAutoFocusRef.current?.(new Event('openautofocus'));

    return () => {
      // Return focus to trigger when closing
      const event = new Event('closeautofocus', { cancelable: true });
      onCloseAutoFocusRef.current?.(event);

      if (!event.defaultPrevented && triggerRef.current && !dismissedByPointerRef.current) {
        (triggerRef.current as HTMLElement).focus({ preventScroll: true });
      }
    };
  }, [isOpen, contentRef, triggerRef]);

  // Escape key handling
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        event.preventDefault();
        closePopover();
      }
    },
    [closePopover, onEscapeKeyDown],
  );

  useDocumentEvent('keydown', handleEscapeKey, isOpen);

  const isFocusTrapped = modal || trapFocus;

  useFocusTrap(contentRef, !!(isOpen && isFocusTrapped));

  // Outside interaction handling
  useInteractOutside([contentRef, triggerRef], {
    enabled: isOpen,
    includeFocus: !isFocusTrapped, // Only include focus events if focus is not trapped
    onPointerDownOutside: (event) => {
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        dismissedByPointerRef.current = true;
        closePopover();
      }
    },
    onFocusOutside: (event) => {
      onFocusOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        closePopover();
      }
    },
  });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Handle Home/End keys within content
      if (event.key === 'Home' || event.key === 'End') {
        const focusableElements = getFocusableElements(event.currentTarget);
        if (focusableElements.length > 0) {
          event.preventDefault();
          const targetElement =
            event.key === 'Home'
              ? focusableElements[0]
              : focusableElements[focusableElements.length - 1];
          targetElement?.focus();
        }
      }
      onKeyDown?.(event);
    },
    [onKeyDown],
  );

  // Extract placement information for data attributes
  const [currentSide, currentAlign] = useMemo(() => {
    const parts = placement.split('-');
    const placementSide = parts[0];
    const placementAlign = parts[1] ?? 'center';
    return [placementSide, placementAlign];
  }, [placement]);

  const contentContextValue = useMemo(
    () => ({ arrowStyles, side: currentSide as Side, align: currentAlign as Align }),
    [arrowStyles, currentSide, currentAlign],
  );

  if (!isOpen || !mounted) return null;

  const ariaAttributes = {
    role: modal ? 'dialog' : undefined,
    'aria-modal': modal ? 'true' : undefined,
  };

  const dataAttributes = {
    'data-state': 'open',
    'data-side': currentSide,
    'data-align': currentAlign,
  };

  const contentProps = {
    ref: floatingRef,
    id: contentId,
    tabIndex: -1,
    ...ariaAttributes,
    ...dataAttributes,
    style: {
      ...floatingStyles,
      ...style,
    },
    onKeyDown: handleKeyDown,
    ...props,
  };

  const contentElement = (
    <PopoverContentContext.Provider value={contentContextValue}>
      <Component {...contentProps}>{children}</Component>
    </PopoverContentContext.Provider>
  );

  return createPortal(contentElement, container || document.body);
};

PopoverContent.displayName = 'PopoverContent';
