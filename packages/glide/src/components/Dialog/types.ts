import type { ElementType, ReactNode, ComponentProps, RefObject } from 'react';

export type DialogState = 'open' | 'closed';

export interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  modal: boolean;
}

/**
 * Props for Dialog.Root component
 */
export interface DialogRootProps {
  /** Controls dialog open state (controlled) */
  open?: boolean;
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether dialog should be modal (trap focus) */
  modal?: boolean;
  /** Component content */
  children?: ReactNode;
}

/**
 * Props for Dialog.Trigger component
 */
export type DialogTriggerProps<T extends ElementType = 'button'> = {
  /** Element type to render */
  as?: T;
  /** Whether trigger is disabled */
  disabled?: boolean;
} & Omit<ComponentProps<T>, 'as' | 'disabled'>;

/**
 * Props for Dialog.Portal component
 */
export interface DialogPortalProps {
  /** Portal container element */
  container?: Element | (() => Element);
  /** Force portal to stay mounted */
  forceMount?: boolean;
  /** Component content */
  children?: ReactNode;
}

/**
 * Props for Dialog.Overlay component
 */
export type DialogOverlayProps<T extends ElementType = 'div'> = {
  /** Element type to render */
  as?: T;
  /** Force overlay to stay mounted */
  forceMount?: boolean;
} & Omit<ComponentProps<T>, 'as'>;

/**
 * Props for Dialog.Content component
 */
export type DialogContentProps<T extends ElementType = 'div'> = {
  /** Element type to render */
  as?: T;
  /** Called when dialog opens and focus moves in */
  onOpenAutoFocus?: (event: Event) => void;
  /** Called when dialog closes and focus moves out */
  onCloseAutoFocus?: (event: Event) => void;
  /** Called when escape key is pressed */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called when pointer down occurs outside */
  onPointerDownOutside?: (event: PointerEvent) => void;
  /** Called when interaction occurs outside */
  onInteractOutside?: (event: Event) => void;
  /** Force content to stay mounted */
  forceMount?: boolean;
  /** Whether to trap focus within dialog */
  trapFocus?: boolean;
} & Omit<ComponentProps<T>, 'as'>;

/**
 * Props for Dialog.Title component
 */
export type DialogTitleProps<T extends ElementType = 'h2'> = {
  /** Element type to render */
  as?: T;
} & Omit<ComponentProps<T>, 'as'>;

/**
 * Props for Dialog.Description component
 */
export type DialogDescriptionProps<T extends ElementType = 'p'> = {
  /** Element type to render */
  as?: T;
} & Omit<ComponentProps<T>, 'as'>;

/**
 * Props for Dialog.Close component
 */
export type DialogCloseProps<T extends ElementType = 'button'> = {
  /** Element type to render */
  as?: T;
} & Omit<ComponentProps<T>, 'as'>;
