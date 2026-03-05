import { useEffect, useState, useCallback, useMemo, type ElementType } from 'react';
import { createPortal } from 'react-dom';
import {
  useInteractOutside,
  useMergedRef,
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from '@/hooks';
import { PopoverContentProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { PopoverContentContext } from './hooks/usePopoverContentContext';
import { getFocusableElements } from './utils/index';
import type { Side } from '../../types';

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

  // Set reference element
  useEffect(() => {
    refs.setReference(triggerRef.current);
  }, [refs, triggerRef]);

  const mergedRef = useMergedRef(contentRef, ref);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      mergedRef(node);
      refs.setFloating(node);
    },
    [mergedRef, refs],
  );

  const [mounted, setMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const contentElement = contentRef.current;

    // Focus first focusable element when opening
    const focusableElements = getFocusableElements(contentElement);
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      contentElement.focus();
    }

    onOpenAutoFocus?.(new Event('openautofocus'));

    return () => {
      // Return focus to trigger when closing
      const event = new Event('closeautofocus', { cancelable: true });
      onCloseAutoFocus?.(event);

      if (!event.defaultPrevented && triggerRef.current) {
        (triggerRef.current as HTMLElement).focus();
      }
    };
  }, [isOpen, onOpenAutoFocus, onCloseAutoFocus, contentRef, triggerRef]);

  // Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePopover();
        onEscapeKeyDown?.(event);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, closePopover, onEscapeKeyDown]);

  // Outside interaction handling
  useInteractOutside([contentRef, triggerRef], {
    enabled: isOpen,
    includeFocus: !trapFocus, // Only include focus events if focus is not trapped
    onPointerDownOutside: (event) => {
      closePopover();
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
    },
    onFocusOutside: (event) => {
      closePopover();
      onFocusOutside?.(event);
      onInteractOutside?.(event);
    },
  });

  // Focus trapping
  useEffect(() => {
    if (!isOpen || !trapFocus || !contentRef.current) return;

    const contentElement = contentRef.current;
    const focusableElements = getFocusableElements(contentElement);

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    contentElement.addEventListener('keydown', handleTabKey);
    return () => contentElement.removeEventListener('keydown', handleTabKey);
  }, [isOpen, trapFocus, contentRef]);

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
    () => ({ arrowStyles, side: currentSide as Side }),
    [arrowStyles, currentSide],
  );

  if (!isOpen || !mounted) return null;

  const contentElement = (
    <PopoverContentContext.Provider value={contentContextValue}>
      <Component
        ref={floatingRef}
        id={contentId}
        role={modal ? 'dialog' : undefined}
        aria-modal={modal ? 'true' : undefined}
        tabIndex={-1}
        data-state='open'
        data-side={currentSide}
        data-align={currentAlign}
        style={{
          ...floatingStyles,
          ...style,
        }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Component>
    </PopoverContentContext.Provider>
  );

  return createPortal(contentElement, container || document.body);
};

PopoverContent.displayName = 'PopoverContent';
