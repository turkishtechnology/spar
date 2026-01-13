import type {
  ReactNode,
  Ref,
  RefObject,
  CSSProperties,
  ButtonHTMLAttributes,
  HTMLAttributes,
} from 'react';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

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
export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether to render as child element instead of button
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Whether trigger is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Ref to the trigger element
   */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Props for PopoverContent component
 * @remarks Fully accessible, headless popover content container
 */
export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
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

  /**
   * Ref to the content element
   */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Props for PopoverArrow component
 * @remarks Purely decorative arrow element
 */
export interface PopoverArrowProps extends HTMLAttributes<HTMLDivElement> {
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

  /**
   * Ref to the arrow element
   */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Props for PopoverAnchor component
 * @remarks Element used as positioning reference instead of trigger
 */
export interface PopoverAnchorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to render as child element instead of div
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Ref to the anchor element
   */
  ref?: Ref<HTMLDivElement>;
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
export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether to render as child element instead of button
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Ref to the close element
   */
  ref?: Ref<HTMLButtonElement>;
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
