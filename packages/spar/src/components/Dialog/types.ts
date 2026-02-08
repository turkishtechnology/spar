import type { ElementType, ReactNode, AriaRole, RefObject } from 'react';
import type { PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

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
   * Always render portal/overlay/content (for animation libraries)
   * @defaultValue false
   */
  forceMount?: boolean;

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
 * Own props for DialogTrigger
 */
export interface DialogTriggerOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: DialogTriggerRenderProps) => ReactNode);
}

/**
 * Props for DialogTrigger
 * @remarks Fully accessible, headless component
 */
export type DialogTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  DialogTriggerOwnProps
>;

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
 * Own props for DialogOverlay
 */
export interface DialogOverlayOwnProps {}

/**
 * Props for DialogOverlay
 * @remarks Fully accessible, headless component
 */
export type DialogOverlayProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DialogOverlayOwnProps
>;

/**
 * Own props for DialogContent
 */
export interface DialogContentOwnProps {
  /**
   * ARIA role for dialog type
   * @defaultValue 'dialog'
   */
  role?: AriaRole;

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
 * Props for DialogContent
 * @remarks Fully accessible, headless component
 */
export type DialogContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DialogContentOwnProps
>;

/**
 * Own props for DialogTitle
 */
export interface DialogTitleOwnProps {
  /**
   * Heading level (1-6)
   * @defaultValue 2
   */
  level?: number;
}

/**
 * Props for DialogTitle
 * @remarks Fully accessible, headless component
 */
export type DialogTitleProps<T extends ElementType = 'h2'> = PolymorphicProps<
  'h2',
  T,
  DialogTitleOwnProps
>;

/**
 * Props for DialogDescription
 * @remarks Fully accessible, headless component
 */
export type DialogDescriptionProps<T extends ElementType = 'p'> = PolymorphicProps<'p', T>;

/**
 * Own props for DialogClose
 */
export interface DialogCloseOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: DialogCloseRenderProps) => ReactNode);
}

/**
 * Props for DialogClose
 * @remarks Fully accessible, headless component
 */
export type DialogCloseProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  DialogCloseOwnProps
>;

/**
 * Context value for Dialog components
 */
export interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modal: boolean;
  disabled: boolean;
  forceMount: boolean;
  role: AriaRole;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  /** @internal Ref for storing the element to restore focus to on close */
  restoreFocusRef: RefObject<HTMLElement | null>;
  /** @internal Ref for close auto-focus callback set by DialogContent */
  onCloseAutoFocusRef: RefObject<((event: Event) => void) | undefined>;
  /** @internal Ref for restoreFocus prop value set by DialogContent */
  restoreFocusPropRef: RefObject<boolean>;
  /** @internal Ref for finalFocus prop set by DialogContent */
  finalFocusPropRef: RefObject<HTMLElement | (() => HTMLElement) | undefined>;
}
