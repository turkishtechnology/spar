import type { ElementType, ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';

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
   * Dialog trigger and portal components
   */
  children: ReactNode;
}

/**
 * Props for DialogTrigger
 * @remarks Fully accessible, headless component
 */
export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Disables trigger interaction
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Ref forwarded to trigger element
   */
  ref?: React.Ref<HTMLElement>;
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
export interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Always render (for animation libraries)
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Ref forwarded to overlay element
   */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Props for DialogContent
 * @remarks Fully accessible, headless component
 */
export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * ARIA role for dialog type
   * @defaultValue 'dialog'
   */
  role?: React.AriaRole;

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

  /**
   * Ref forwarded to content element
   */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Props for DialogTitle
 * @remarks Fully accessible, headless component
 */
export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'h2'
   */
  as?: ElementType;

  /**
   * Heading level (1-6)
   * @defaultValue 2
   */
  level?: number;

  /**
   * Ref forwarded to title element
   */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Props for DialogDescription
 * @remarks Fully accessible, headless component
 */
export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'p'
   */
  as?: ElementType;

  /**
   * Ref forwarded to description element
   */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Props for DialogClose
 * @remarks Fully accessible, headless component
 */
export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Ref forwarded to close button element
   */
  ref?: React.Ref<HTMLElement>;
}

/**
 * Context value for Dialog components
 */
export interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modal: boolean;
  role: React.AriaRole;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
}
