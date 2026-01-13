import type { ComponentProps, ElementType, ReactNode, AriaRole, RefObject } from 'react';

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
export interface DialogTriggerProps extends ComponentProps<'button'> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;
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
  as?: ElementType;

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
  as?: ElementType;

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
  as?: ElementType;

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
  as?: ElementType;
}

/**
 * Props for DialogClose
 * @remarks Fully accessible, headless component
 */
export interface DialogCloseProps extends ComponentProps<'button'> {
  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;
}

/**
 * Context value for Dialog components
 */
export interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modal: boolean;
  role: AriaRole;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
}
