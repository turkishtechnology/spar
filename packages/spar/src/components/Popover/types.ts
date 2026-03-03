import type { ElementType, ReactNode, RefObject, CSSProperties } from 'react';
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
   * Preferred side for popover positioning
   * @defaultValue 'bottom'
   */
  side?: Side;

  /**
   * Preferred alignment relative to trigger
   * @defaultValue 'center'
   */
  align?: Align;

  /**
   * Distance in pixels between trigger and popover
   * @defaultValue 8
   */
  sideOffset?: number;

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
   * Distance from trigger
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Offset along alignment axis
   * @defaultValue 0
   */
  alignOffset?: number;

  /**
   * Whether to adjust position to avoid viewport collisions
   * @defaultValue true
   */
  avoidCollisions?: boolean;

  /**
   * Boundary elements for collision detection
   */
  collisionBoundary?: Element | Element[];

  /**
   * Whether to hide when trigger is occluded
   * @defaultValue false
   */
  hideWhenDetached?: boolean;

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
 * Own props for PopoverArrow component
 */
export interface PopoverArrowOwnProps {
  /**
   * Arrow width in pixels
   * @defaultValue 10
   */
  width?: number;

  /**
   * Arrow height in pixels
   * @defaultValue 5
   */
  height?: number;

  /**
   * Offset along the edge
   * @defaultValue 0
   */
  offset?: number;
}

/**
 * Props for PopoverArrow component
 * @remarks Purely decorative arrow element
 */
export type PopoverArrowProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  PopoverArrowOwnProps
>;

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
  side: Side;
  align: Align;
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
  arrowRef: RefObject<HTMLDivElement | null>;
  floatingStyles: CSSProperties;
  modal: boolean;
  disabled: boolean;
  side: Side;
  align: Align;
  sideOffset: number;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  onOpenChange?: (open: boolean) => void;
}
