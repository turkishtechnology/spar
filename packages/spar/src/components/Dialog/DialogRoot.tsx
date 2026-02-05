import { createContext, useContext, useMemo, useRef, useId } from 'react';
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

  // Controlled/uncontrolled state management
  const [isOpen, setIsOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange);

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
    }),
    [isOpen, setIsOpen, modal, disabled, forceMount, titleId, descriptionId],
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

DialogRoot.displayName = 'DialogRoot';
