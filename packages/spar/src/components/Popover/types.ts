import type { ElementType, ReactNode, RefObject } from 'react';
import type { Side, Align, PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

/**
 * Render props provided to PopoverTrigger children function
 */
export interface PopoverTriggerRenderProps {
  /**
   * Whether the popover is currently open
   */
  isOpen: boolean;
  /**
   * Whether the trigger is disabled
   */
  disabled: boolean;
  /**
   * Function to open the popover
   */
  open: () => void;
  /**
   * Function to close the popover
   */
  close: () => void;
  /**
   * Function to toggle the popover open/closed state
   */
  toggle: () => void;
}

/**
 * Render props provided to PopoverClose children function
 */
export interface PopoverCloseRenderProps {
  /**
   * Whether the popover is currently open
   */
  isOpen: boolean;
  /**
   * Function to close the popover
   */
  close: () => void;
}

/**
 * Props for Popover component
 * @remarks Fully accessible, headless popover root container
 */
export interface PopoverProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger` and `${id}-content`.
   */
  id?: string;

  /**
   * Controlled state for popover visibility
   */
  open?: boolean;

  /**
   * Callback when popover open state changes
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Initial open state for uncontrolled mode
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Whether popover should behave modally (focus trap + backdrop)
   * @defaultValue false
   */
  modal?: boolean;

  /**
   * Disables all popover triggers (prevents opening)
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * PopoverTrigger and PopoverContent components
   */
  children?: ReactNode;
}

/**
 * Own props for PopoverTrigger component
 */
export interface PopoverTriggerOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: PopoverTriggerRenderProps) => ReactNode);
}

/**
 * Props for PopoverTrigger component
 * @remarks Fully accessible, headless popover trigger
 */
export type PopoverTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  PopoverTriggerOwnProps
>;

/**
 * Own props for PopoverContent component
 */
export interface PopoverContentOwnProps {
  /**
   * Side of trigger to position against
   * @defaultValue 'bottom'
   */
  side?: Side;

  /**
   * Alignment relative to trigger
   * @defaultValue 'center'
   */
  align?: Align;

  /**
   * Portal container element. Content is portaled to document.body by default.
   * @defaultValue document.body
   */
  container?: HTMLElement | null;

  /**
   * Called when popover opens and focus moves inside
   * @param event - The focus event (call preventDefault to prevent auto-focus)
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Called when popover closes and focus returns to trigger
   * @param event - The focus event (call preventDefault to prevent focus restore)
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Called when escape is pressed
   * @param event - The keyboard event (call preventDefault to prevent close)
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Called when pointer down occurs outside the content
   * @param event - The pointer event (call preventDefault to prevent close)
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Called when focus moves outside the content
   * @param event - The focus event (call preventDefault to prevent close)
   */
  onFocusOutside?: (event: FocusEvent) => void;

  /**
   * Called when interaction occurs outside the content
   * @param event - The pointer or focus event (call preventDefault to prevent close)
   */
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;

  /**
   * Whether to trap focus within content
   * @defaultValue false
   */
  trapFocus?: boolean;
}

/**
 * Props for PopoverContent component
 * @remarks Fully accessible, headless popover content container
 */
export type PopoverContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  PopoverContentOwnProps
>;

/**
 * Props for PopoverArrow component
 * @remarks Purely decorative arrow element. Headless: user provides all visuals.
 */
export type PopoverArrowProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Own props for PopoverClose component
 */
export interface PopoverCloseOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: PopoverCloseRenderProps) => ReactNode);
}

/**
 * Props for PopoverClose component
 * @remarks Close trigger that automatically closes the popover
 */
export type PopoverCloseProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  PopoverCloseOwnProps
>;

/**
 * @internal
 */
export interface PopoverState {
  isOpen: boolean;
  triggerRect: DOMRect | null;
  contentRect: DOMRect | null;
  actualSide: Side;
  actualAlign: Align;
  isPositioned: boolean;
  triggerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  contentId: string;
}

/**
 * Context value for sharing popover state between components
 * @internal
 */
export interface PopoverContextValue {
  state: PopoverState;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  arrowRef: RefObject<Element | null>;
  modal: boolean;
  disabled: boolean;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  onOpenChange?: (open: boolean) => void;
}
