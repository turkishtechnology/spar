import { createContext, useContext, useEffect, useMemo, useRef, useId } from 'react';
import { useControlledState } from '@/hooks';
import type { DialogRootProps, DialogContextValue } from './types';

const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a DialogRoot');
  }
  return context;
};

/**
 * Root component that manages dialog state and provides context to child components.
 * Supports both modal and non-modal dialogs with controlled/uncontrolled patterns.
 */
export const DialogRoot = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  disabled = false,
  forceMount = false,
  children,
}: DialogRootProps) => {
  // Generate unique IDs for ARIA relationships
  const titleId = useId();
  const descriptionId = useId();

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

  // Track previous open state for close transition detection
  const wasOpenRef = useRef(isOpen ?? false);

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
      modal,
      disabled,
      forceMount,
      role: 'dialog',
      triggerRef,
      contentRef,
      titleId,
      descriptionId,
      restoreFocusRef,
      onCloseAutoFocusRef,
      restoreFocusPropRef,
      finalFocusPropRef,
    }),
    [isOpen, setIsOpen, modal, disabled, forceMount, titleId, descriptionId],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

DialogRoot.displayName = 'DialogRoot';
