import { useEffect, useCallback, useRef, useState, ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useMergedRef, useInteractOutside, useFocusTrap } from '@/hooks';
import { useDialogContext } from './hooks';
import type { DialogContentProps } from './types';

/**
 * Main dialog content container with focus management and keyboard handling.
 * Implements modal focus trapping and ARIA attributes for accessibility.
 */
export const DialogContent = <T extends ElementType = 'div'>({
  as,
  role = 'dialog',
  trapFocus = true,
  restoreFocus = true,
  initialFocus,
  finalFocus,
  container,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onKeyDown,
  ref,
  children,
  ...props
}: DialogContentProps<T>) => {
  const Component = as || 'div';
  const {
    isOpen,
    setIsOpen,
    modal,
    forceMount,
    triggerRef,
    contentRef,
    titleId,
    descriptionId,
    contentId,
    restoreFocusRef,
    onCloseAutoFocusRef,
    restoreFocusPropRef,
    finalFocusPropRef,
  } = useDialogContext();

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(contentRef, ref as React.RefObject<HTMLElement | null>);

  // Store callbacks in refs to avoid re-running effects when they change
  const onOpenAutoFocusRef = useRef(onOpenAutoFocus);
  const initialFocusRef = useRef(initialFocus);

  // Track whether open focus has already been handled to prevent StrictMode double-fire
  const hasOpenFocusedRef = useRef(false);

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep refs updated with latest values
  onOpenAutoFocusRef.current = onOpenAutoFocus;
  initialFocusRef.current = initialFocus;

  // Sync close-focus props to context refs so Dialog can handle close focus
  onCloseAutoFocusRef.current = onCloseAutoFocus;
  restoreFocusPropRef.current = restoreFocus;
  finalFocusPropRef.current = finalFocus;

  // Store active element before dialog opens for focus restoration
  useEffect(() => {
    if (isOpen) {
      if (restoreFocus || finalFocus) {
        // Only capture if not already captured (prevent StrictMode overwrite)
        if (!restoreFocusRef.current) {
          restoreFocusRef.current = document.activeElement as HTMLElement;
        }
      }
    } else {
      restoreFocusRef.current = null;
    }
  }, [isOpen, restoreFocus, finalFocus, restoreFocusRef]);

  // Handle open auto-focus
  useEffect(() => {
    if (!isOpen || !mounted) {
      hasOpenFocusedRef.current = false;
      return;
    }

    // Prevent StrictMode double-fire
    if (hasOpenFocusedRef.current) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    hasOpenFocusedRef.current = true;

    // Focus initial element
    const focusElement = (() => {
      const initFocus = initialFocusRef.current;
      if (initFocus) {
        return typeof initFocus === 'function' ? initFocus() : initFocus;
      }

      // Focus strategies based on role
      if (role === 'alertdialog') {
        // For alert dialogs, focus the least destructive action
        const buttons = contentElement.querySelectorAll('button');
        // Look for cancel, close, or dismiss buttons first
        const cancelButton = Array.from(buttons).find((btn) =>
          /cancel|close|dismiss/i.test(btn.textContent || ''),
        );
        if (cancelButton) return cancelButton as HTMLElement;
      }

      // Default: first focusable element
      const focusableElements = contentElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      return focusableElements[0] as HTMLElement;
    })();

    if (focusElement) {
      const event = new Event('focus', { cancelable: true });
      onOpenAutoFocusRef.current?.(event);

      if (!event.defaultPrevented) {
        focusElement.focus();
      }
    }
  }, [isOpen, mounted, role, contentRef]);

  // Focus trap for modal dialogs
  useFocusTrap(contentRef, !!(isOpen && mounted && modal && trapFocus));

  // Escape key handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event.nativeEvent);
        if (!event.defaultPrevented) {
          setIsOpen(false);
        }
      }
    },
    [onEscapeKeyDown, onKeyDown, setIsOpen],
  );

  // Outside interaction handler — works for both modal and non-modal dialogs.
  // Excludes triggerRef so clicking the trigger doesn't double-fire dismiss.
  useInteractOutside([contentRef, triggerRef], {
    enabled: isOpen,
    onPointerDownOutside: (event) => {
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    },
  });

  // Don't render if dialog is closed and not force mounted
  if (!isOpen && !forceMount) {
    return null;
  }

  // Don't render on server
  if (!mounted) {
    return null;
  }

  const dataState = isOpen ? 'open' : 'closed';

  const ariaAttributes = {
    'aria-modal': modal,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
  };

  const dataAttributes = {
    'data-state': dataState,
    'data-modal': modal ? 'true' : 'false',
    'data-role': role,
  };

  const contentProps = {
    ref: mergedRef,
    ...props,
    id: contentId,
    role,
    ...ariaAttributes,
    ...dataAttributes,
    onKeyDown: handleKeyDown,
  };

  const portalContainer = container || document.body;

  const contentElement = <Component {...contentProps}>{children}</Component>;

  return createPortal(contentElement, portalContainer);
};

DialogContent.displayName = 'DialogContent';
