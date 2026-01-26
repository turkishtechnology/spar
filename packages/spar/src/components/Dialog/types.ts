import type { ComponentProps, ReactNode, AriaRole, RefObject } from 'react';
import type { PolymorphicAs } from '../../types';

/**
 * Props for DialogRoot
 * @remarks Fully accessible, headless component
 */
export interface DialogRootProps {
  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Initial open state (uncontrolled)
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Whether dialog is modal (blocks interaction outside)
   * @defaultValue true
   */
  modal?: boolean;

  /**
   * Disables all dialog triggers (prevents opening)
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Dialog trigger and portal components
   */
  children: ReactNode;
}

/**
 * Render props provided to children function for DialogTrigger
 */
export interface DialogTriggerRenderProps {
  /**
   * Whether the dialog is currently open
   */
  isOpen: boolean;
  /**
   * Whether the dialog trigger is disabled
   */
  disabled: boolean;
  /**
   * Function to open the dialog
   */
  open: () => void;
  /**
   * Function to close the dialog
   */
  close: () => void;
  /**
   * Function to toggle the dialog open/closed state
   */
  toggle: () => void;
}

/**
 * Props for DialogTrigger
 * @remarks Fully accessible, headless component
 */
export interface DialogTriggerProps extends Omit<ComponentProps<'button'>, 'children'> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: PolymorphicAs;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: DialogTriggerRenderProps) => ReactNode);
}

/**
 * Render props provided to children function for DialogClose
 */
export interface DialogCloseRenderProps {
  /**
   * Whether the dialog is currently open
   */
  isOpen: boolean;
  /**
   * Function to close the dialog
   */
  close: () => void;
}

/**
 * Props for DialogPortal
 * @remarks Fully accessible, headless component
 */
export interface DialogPortalProps {
  /**
   * Portal container element
   * @defaultValue document.body
   */
  container?: HTMLElement | null;

  /**
   * Dialog overlay and content
   */
  children: ReactNode;
}

/**
 * Props for DialogOverlay
 * @remarks Fully accessible, headless component
 */
export interface DialogOverlayProps extends ComponentProps<'div'> {
  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: PolymorphicAs;

  /**
   * Always render (for animation libraries)
   * @defaultValue false
   */
  forceMount?: boolean;
}

/**
 * Props for DialogContent
 * @remarks Fully accessible, headless component
 */
export interface DialogContentProps extends ComponentProps<'div'> {
  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: PolymorphicAs;

  /**
   * ARIA role for dialog type
   * @defaultValue 'dialog'
   */
  role?: AriaRole;

  /**
   * Always render (for animation libraries)
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Enable focus trapping
   * @defaultValue true
   */
  trapFocus?: boolean;

  /**
   * Restore focus on close
   * @defaultValue true
   */
  restoreFocus?: boolean;

  /**
   * Element to focus on open
   */
  initialFocus?: HTMLElement | (() => HTMLElement);

  /**
   * Element to focus on close
   */
  finalFocus?: HTMLElement | (() => HTMLElement);

  /**
   * Callback before auto-focus
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Callback before focus restore
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Escape key handler
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside click handler
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Outside interaction handler with preventDefault capability
   */
  onInteractOutside?: (event: PointerEvent) => void;
}

/**
 * Props for DialogTitle
 * @remarks Fully accessible, headless component
 */
export interface DialogTitleProps extends ComponentProps<'h2'> {
  /**
   * Polymorphic element type
   * @defaultValue 'h2'
   */
  as?: PolymorphicAs;

  /**
   * Heading level (1-6)
   * @defaultValue 2
   */
  level?: number;
}

/**
 * Props for DialogDescription
 * @remarks Fully accessible, headless component
 */
export interface DialogDescriptionProps extends ComponentProps<'p'> {
  /**
   * Polymorphic element type
   * @defaultValue 'p'
   */
  as?: PolymorphicAs;
}

/**
 * Props for DialogClose
 * @remarks Fully accessible, headless component
 */
export interface DialogCloseProps extends Omit<ComponentProps<'button'>, 'children'> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: PolymorphicAs;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: DialogCloseRenderProps) => ReactNode);
}

/**
 * Context value for Dialog components
 */
export interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modal: boolean;
  disabled: boolean;
  role: AriaRole;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
}
