import { useCallback, useEffect, useMemo, useRef, useId } from 'react';
import { useControlledState, useScrollLock } from '@/hooks';
import { DialogContext } from './hooks';
import type { DialogProps, DialogContextValue } from './types';

/**
 * Root component that manages dialog state and provides context to child components.
 * Supports both modal and non-modal dialogs with controlled/uncontrolled patterns.
 */
export const Dialog = ({
  id: providedId,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  disabled = false,
  forceMount = false,
  children,
}: DialogProps) => {
  // Generate unique IDs for ARIA relationships
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const contentId = `${baseId}-content`;

  // Refs for focus management
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  // Refs for close focus management (populated by DialogContent)
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const onCloseAutoFocusRef = useRef<((event: Event) => void) | undefined>(undefined);
  const restoreFocusPropRef = useRef<boolean>(true);
  const finalFocusPropRef = useRef<HTMLElement | (() => HTMLElement) | undefined>(undefined);

  // Controlled/uncontrolled state management
  const [isOpen, setIsOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange);

  const closeDialog = useCallback(() => setIsOpen(false), [setIsOpen]);

  // Track previous open state for close transition detection
  const wasOpenRef = useRef(isOpen ?? false);

  // Lock body scroll when modal dialog is open (reference-counted for nested dialogs)
  useScrollLock(!!(modal && isOpen));

  // Handle close focus restoration when isOpen transitions from true to false
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen ?? false;

    if (!isOpen && wasOpen) {
      const finalFocusElement = finalFocusPropRef.current;
      const elementToFocus = finalFocusElement
        ? typeof finalFocusElement === 'function'
          ? finalFocusElement()
          : finalFocusElement
        : restoreFocusPropRef.current
          ? restoreFocusRef.current
          : null;

      if (elementToFocus) {
        const event = new Event('focus', { cancelable: true });
        onCloseAutoFocusRef.current?.(event);

        if (!event.defaultPrevented) {
          elementToFocus.focus();
        }
      }

      // Clear refs
      restoreFocusRef.current = null;
    }
  }, [isOpen]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<DialogContextValue>(
    () => ({
      isOpen: isOpen ?? false,
      setIsOpen,
      closeDialog,
      modal,
      disabled,
      forceMount,
      role: 'dialog',
      triggerRef,
      contentRef,
      titleId,
      descriptionId,
      contentId,
      restoreFocusRef,
      onCloseAutoFocusRef,
      restoreFocusPropRef,
      finalFocusPropRef,
    }),
    [
      isOpen,
      setIsOpen,
      closeDialog,
      modal,
      disabled,
      forceMount,
      titleId,
      descriptionId,
      contentId,
    ],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

Dialog.displayName = 'Dialog';
