import type { ComponentProps, ReactNode, RefObject, CSSProperties } from 'react';
import type { PrimitiveButtonProps } from '../Primitives/PrimitiveButton/types';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

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
 * Render props provided to PopoverAnchor children function
 */
export interface PopoverAnchorRenderProps {
  /**
   * Whether the popover is currently open
   */
  isOpen: boolean;
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
 * Props for PopoverRoot component
 * @remarks Fully accessible, headless popover root container
 */
export interface PopoverRootProps {
  /**
   * Controlled state for popover visibility
   */
  open?: boolean;

  /**
   * Callback when popover open state changes
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
  side?: PopoverSide;

  /**
   * Preferred alignment relative to trigger
   * @defaultValue 'center'
   */
  align?: PopoverAlign;

  /**
   * Distance in pixels between trigger and popover
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * PopoverTrigger and PopoverContent components
   */
  children: ReactNode;
}

/**
 * Props for PopoverTrigger component
 * @remarks Fully accessible, headless popover trigger
 */
export interface PopoverTriggerProps extends Omit<PrimitiveButtonProps, 'children'> {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: PopoverTriggerRenderProps) => ReactNode);
}

/**
 * Props for PopoverContent component
 * @remarks Fully accessible, headless popover content container
 */
export interface PopoverContentProps extends ComponentProps<'div'> {
  /**
   * Side of trigger to position against
   * @defaultValue 'bottom'
   */
  side?: PopoverSide;

  /**
   * Alignment relative to trigger
   * @defaultValue 'center'
   */
  align?: PopoverAlign;

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
   * Called when popover opens and focus moves inside
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Called when popover closes and focus returns to trigger
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Called when escape is pressed
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Called when pointer down occurs outside the content
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Called when focus moves outside the content
   */
  onFocusOutside?: (event: FocusEvent) => void;

  /**
   * Called when interaction occurs outside the content
   */
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;

  /**
   * Whether to trap focus within content
   * @defaultValue false
   */
  trapFocus?: boolean;
}

/**
 * Props for PopoverArrow component
 * @remarks Purely decorative arrow element
 */
export interface PopoverArrowProps extends ComponentProps<'div'> {
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
 * Props for PopoverAnchor component
 * @remarks Element used as positioning reference instead of trigger
 */
export interface PopoverAnchorProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: PopoverAnchorRenderProps) => ReactNode);
}

/**
 * Props for PopoverPortal component
 * @remarks Portal container for popover content
 */
export interface PopoverPortalProps {
  /**
   * Container element to portal content into
   * @defaultValue document.body
   */
  container?: Element | null;

  /**
   * Content to be portaled (typically PopoverContent)
   */
  children: ReactNode;
}

/**
 * Props for PopoverClose component
 * @remarks Close trigger that automatically closes the popover
 */
export interface PopoverCloseProps extends Omit<PrimitiveButtonProps, 'children'> {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: PopoverCloseRenderProps) => ReactNode);
}

/**
 * Internal state for popover management
 */
export interface PopoverState {
  isOpen: boolean;
  triggerRect: DOMRect | null;
  contentRect: DOMRect | null;
  side: PopoverSide;
  align: PopoverAlign;
  actualSide: PopoverSide;
  actualAlign: PopoverAlign;
  isPositioned: boolean;
  triggerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  anchorElement: HTMLElement | null;
  contentId: string;
}

/**
 * Context value for sharing popover state between components
 */
export interface PopoverContextValue {
  state: PopoverState;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  anchorRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<HTMLDivElement | null>;
  floatingStyles: CSSProperties;
  modal: boolean;
  disabled: boolean;
  side: PopoverSide;
  align: PopoverAlign;
  sideOffset: number;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  onOpenChange?: (open: boolean) => void;
}
