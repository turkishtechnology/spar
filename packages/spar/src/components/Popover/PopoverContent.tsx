import { useEffect, useState, useCallback, type ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useInteractOutside, useMergedRef } from '@/hooks';
import { PopoverContentProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { getFocusableElements } from './utils/index';

/**
 * Content container that holds the popover content
 */
export const PopoverContent = <T extends ElementType = 'div'>({
  as,
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
  // Positioning props are handled by usePopover hook via Floating UI middleware.
  // Destructured here to prevent them from being spread onto the DOM element.
  side: _side,
  align: _align,
  sideOffset: _sideOffset,
  alignOffset: _alignOffset,
  collisionBoundary: _collisionBoundary,
  hideWhenDetached: _hideWhenDetached,
  avoidCollisions: _avoidCollisions,
  ...props
}: PopoverContentProps<T>) => {
  const Component = as || 'div';

  const { state, triggerRef, contentRef, floatingStyles, modal, closePopover } =
    usePopoverContext();

  const mergedRef = useMergedRef(contentRef as React.RefObject<HTMLDivElement | null>, ref);

  const [mounted, setMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management
  useEffect(() => {
    if (!state.isOpen || !contentRef.current) return;

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
  }, [state.isOpen, onOpenAutoFocus, onCloseAutoFocus, contentRef, triggerRef]);

  // Escape key handling
  useEffect(() => {
    if (!state.isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event);

        if (!event.defaultPrevented) {
          event.preventDefault();
          closePopover();
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [state.isOpen, closePopover, onEscapeKeyDown]);

  // Outside interaction handling
  useInteractOutside([contentRef, triggerRef], {
    enabled: state.isOpen,
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
    if (!state.isOpen || !trapFocus || !contentRef.current) return;

    const contentElement = contentRef.current;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      // Query focusable elements on each Tab press to handle dynamic content
      const focusableElements = getFocusableElements(contentElement);
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

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
  }, [state.isOpen, trapFocus, contentRef]);

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

  if (!state.isOpen || !mounted) return null;

  const contentElement = (
    <Component
      ref={mergedRef}
      id={state.contentId}
      role={modal ? 'dialog' : undefined}
      aria-modal={modal ? 'true' : undefined}
      tabIndex={-1}
      data-state='open'
      data-side={state.actualSide}
      data-align={state.actualAlign}
      style={{
        ...floatingStyles,
        ...style,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );

  return createPortal(contentElement, container || document.body);
};

PopoverContent.displayName = 'PopoverContent';
