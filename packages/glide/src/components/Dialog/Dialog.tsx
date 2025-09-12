import {
  useState,
  useRef,
  useId,
  createContext,
  useContext,
  createElement,
  type ElementType,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogContextValue,
} from './types';

// Create Dialog context
const DialogContext = createContext<DialogContextValue | null>(null);

// Custom hook to use dialog context
const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog.Root');
  }
  return context;
};

// Custom hook for controlled/uncontrolled state
const useControlled = <T,>({
  controlled,
  defaultValue,
  name,
}: {
  controlled: T | undefined;
  defaultValue: T;
  name: string;
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const controlled_ref = useRef(controlled !== undefined);

  if (controlled_ref.current !== (controlled !== undefined)) {
    // eslint-disable-next-line no-console
    console.error(
      `A component is changing the ${name} state from ${
        controlled_ref.current ? 'controlled' : 'uncontrolled'
      } to ${controlled !== undefined ? 'controlled' : 'uncontrolled'}.`,
    );
  }

  const value = controlled !== undefined ? controlled : uncontrolledValue;
  const setValue = controlled !== undefined ? () => {} : setUncontrolledValue;

  return [value, setValue] as const;
};

// Custom hook to merge refs
const useMergeRefs = <T,>(...refs: (RefObject<T> | ((node: T) => void) | null | undefined)[]) => {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = node;
      }
    });
  };
};

/**
 * Dialog root component that manages open/close state and provides context to child components.
 * Supports both controlled and uncontrolled usage patterns.
 */
export const DialogRoot = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  children,
}: DialogRootProps) => {
  const [open, setOpen] = useControlled({
    controlled: controlledOpen,
    defaultValue: defaultOpen,
    name: 'Dialog',
  });

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const contextValue: DialogContextValue = {
    open,
    onOpenChange: handleOpenChange,
    triggerRef,
    contentRef,
    titleId,
    descriptionId,
    modal,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      <div data-state={open ? 'open' : 'closed'}>{children}</div>
    </DialogContext.Provider>
  );
};

/**
 * Dialog trigger component that opens the dialog when activated.
 * Supports keyboard activation and maintains accessibility attributes.
 */
export const DialogTrigger = <T extends ElementType = 'button'>({
  as,
  disabled = false,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogTriggerProps<T>) => {
  const { open, onOpenChange, triggerRef } = useDialogContext();
  const Component = as || 'button';

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?.(event as any);
    onOpenChange(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeyDown?.(event as any);

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenChange(true);
    }
  };

  return createElement(Component, {
    ...props,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: useMergeRefs(triggerRef, (props as any).ref),
    disabled: Component === 'button' ? disabled : undefined,
    'aria-expanded': open,
    'data-state': open ? 'open' : 'closed',
    'data-disabled': disabled ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    children,
  });
};

/**
 * Dialog portal component that renders dialog content in a different part of the DOM tree.
 * Ensures proper stacking context and accessibility.
 */
export const DialogPortal = ({ container, forceMount = false, children }: DialogPortalProps) => {
  const { open } = useDialogContext();

  if (!forceMount && !open) {
    return null;
  }

  const mountNode =
    typeof container === 'function'
      ? container()
      : container || (typeof document !== 'undefined' ? document.body : null);

  if (!mountNode) {
    return null;
  }

  return createPortal(children, mountNode);
};

/**
 * Dialog overlay component that provides the backdrop behind the dialog content.
 * Handles click-outside-to-close behavior.
 */
export const DialogOverlay = <T extends ElementType = 'div'>({
  as,
  forceMount = false,
  onClick,
  children,
  ...props
}: DialogOverlayProps<T>) => {
  const { open, onOpenChange } = useDialogContext();
  const Component = as || 'div';

  if (!forceMount && !open) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?.(event as any);
    // Close dialog when clicking overlay
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return createElement(Component, {
    ...props,
    role: 'presentation',
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
    children,
  });
};

/**
 * Dialog content component that contains the main dialog UI.
 * Handles focus management, keyboard navigation, and accessibility attributes.
 */
export const DialogContent = <T extends ElementType = 'div'>({
  as,
  onOpenAutoFocus: _onOpenAutoFocus,
  onCloseAutoFocus: _onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside: _onPointerDownOutside,
  onInteractOutside: _onInteractOutside,
  forceMount = false,
  trapFocus: _trapFocus = true,
  onKeyDown,
  children,
  ...props
}: DialogContentProps<T>) => {
  const { open, onOpenChange, contentRef, triggerRef, titleId, descriptionId, modal } =
    useDialogContext();

  const Component = as || 'div';

  if (!forceMount && !open) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeyDown?.(event as any);

    if (event.key === 'Escape') {
      onEscapeKeyDown?.(event.nativeEvent);
      if (!event.defaultPrevented) {
        onOpenChange(false);
        // Return focus to trigger
        triggerRef.current?.focus();
      }
    }
  };

  // Focus management effect would be added here in a full implementation
  // This is a simplified version focusing on the core logic

  return createElement(Component, {
    ...props,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: useMergeRefs(contentRef, (props as any).ref),
    role: 'dialog',
    'aria-modal': modal,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    'data-state': open ? 'open' : 'closed',
    onKeyDown: handleKeyDown,
    tabIndex: -1,
    children,
  });
};

/**
 * Dialog title component that provides an accessible name for the dialog.
 * Automatically linked to dialog content via aria-labelledby.
 */
export const DialogTitle = <T extends ElementType = 'h2'>({
  as,
  children,
  ...props
}: DialogTitleProps<T>) => {
  const { open, titleId } = useDialogContext();
  const Component = as || 'h2';

  return createElement(Component, {
    ...props,
    id: titleId,
    'data-state': open ? 'open' : 'closed',
    children,
  });
};

/**
 * Dialog description component that provides additional context for the dialog.
 * Automatically linked to dialog content via aria-describedby.
 */
export const DialogDescription = <T extends ElementType = 'p'>({
  as,
  children,
  ...props
}: DialogDescriptionProps<T>) => {
  const { open, descriptionId } = useDialogContext();
  const Component = as || 'p';

  return createElement(Component, {
    ...props,
    id: descriptionId,
    'data-state': open ? 'open' : 'closed',
    children,
  });
};

/**
 * Dialog close component that closes the dialog when activated.
 * Returns focus to the original trigger element.
 */
export const DialogClose = <T extends ElementType = 'button'>({
  as,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogCloseProps<T>) => {
  const { open, onOpenChange, triggerRef } = useDialogContext();
  const Component = as || 'button';

  const handleClick = (event: React.MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick?.(event as any);
    onOpenChange(false);
    // Return focus to trigger
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onKeyDown?.(event as any);

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenChange(false);
      triggerRef.current?.focus();
    }
  };

  return createElement(Component, {
    ...props,
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    children,
  });
};

/**
 * Dialog compound component with all sub-components attached.
 * Provides a modal dialog overlay that interrupts user workflow to capture attention or gather input.
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

// Set display names for better debugging
DialogRoot.displayName = 'Dialog.Root';
DialogTrigger.displayName = 'Dialog.Trigger';
DialogPortal.displayName = 'Dialog.Portal';
DialogOverlay.displayName = 'Dialog.Overlay';
DialogContent.displayName = 'Dialog.Content';
DialogTitle.displayName = 'Dialog.Title';
DialogDescription.displayName = 'Dialog.Description';
DialogClose.displayName = 'Dialog.Close';
