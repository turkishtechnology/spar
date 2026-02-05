import { useEffect, useCallback, useRef, ElementType } from 'react';
import { useMergedRef, useInteractOutside } from '@/hooks';
import { useDialogContext } from './DialogRoot';
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
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  ref,
  children,
  ...props
}: DialogContentProps<T>) => {
  const Component = as || 'div';
  const { isOpen, setIsOpen, modal, forceMount, contentRef, titleId, descriptionId } =
    useDialogContext();

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(contentRef, ref as React.RefObject<HTMLElement | null>);

  // Store previous focus element for restoration
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Focus management on open
  useEffect(() => {
    if (!isOpen) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Store current focus for restoration
    if (restoreFocus) {
      restoreFocusRef.current = document.activeElement as HTMLElement;
    }

    // Focus initial element
    const focusElement = (() => {
      if (initialFocus) {
        return typeof initialFocus === 'function' ? initialFocus() : initialFocus;
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
      onOpenAutoFocus?.(new Event('focus'));
      focusElement.focus();
    }
  }, [isOpen, initialFocus, role, onOpenAutoFocus, restoreFocus]);

  // Focus restoration on close
  useEffect(() => {
    if (isOpen) return;

    if (restoreFocus && restoreFocusRef.current) {
      const elementToFocus = finalFocus
        ? typeof finalFocus === 'function'
          ? finalFocus()
          : finalFocus
        : restoreFocusRef.current;

      if (elementToFocus) {
        onCloseAutoFocus?.(new Event('focus'));
        elementToFocus.focus();
      }
    }
  }, [isOpen, finalFocus, restoreFocus, onCloseAutoFocus]);

  // Focus trap for modal dialogs
  useEffect(() => {
    if (!isOpen || !modal || !trapFocus) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = contentElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const focusableArray = Array.from(focusableElements) as HTMLElement[];

      if (focusableArray.length === 0) return;

      const firstElement = focusableArray[0];
      const lastElement = focusableArray[focusableArray.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modal, trapFocus]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event.nativeEvent);
        if (!event.defaultPrevented) {
          setIsOpen(false);
        }
      }
    },
    [onEscapeKeyDown, setIsOpen],
  );

  // Outside interaction handler
  useInteractOutside([contentRef], {
    enabled: isOpen && modal,
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

  const dataState = isOpen ? 'open' : 'closed';

  return (
    <Component
      ref={mergedRef}
      role={role}
      aria-modal={modal}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-state={dataState}
      data-modal={modal ? 'true' : 'false'}
      data-role={role}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
};

DialogContent.displayName = 'DialogContent';
