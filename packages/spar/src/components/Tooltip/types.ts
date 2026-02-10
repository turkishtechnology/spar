import type { ElementType, ReactNode, RefObject } from 'react';
import { Side, Align, PolymorphicProps } from '../../types';

export type Sticky = 'partial' | 'always';

/**
 * Render props provided to TooltipTrigger children function
 */
export interface TooltipTriggerRenderProps {
  /**
   * Whether the tooltip is currently visible
   */
  isOpen: boolean;
  /**
   * Whether the tooltip is disabled
   */
  disabled: boolean;
  /**
   * Current placement side of the tooltip
   */
  placement: Side;
  /**
   * Function to show the tooltip
   */
  show: () => void;
  /**
   * Function to hide the tooltip
   */
  hide: () => void;
}

/**
 * Props for TooltipProvider
 * @remarks Provides shared configuration for multiple tooltip instances
 */
export interface TooltipProviderProps {
  /**
   * Tooltip components to share provider context
   */
  children?: ReactNode;

  /**
   * Global delay duration for all tooltips
   * @defaultValue 700
   */
  delayDuration?: number;

  /**
   * Duration to skip delay when moving between tooltips
   * @defaultValue 300
   */
  skipDelayDuration?: number;

  /**
   * Disable hoverable content globally
   * @defaultValue false
   */
  disableHoverableContent?: boolean;
}

/**
 * Props for Tooltip
 * @remarks Root component that manages tooltip state
 */
export interface TooltipProps {
  /**
   * Tooltip trigger and content components
   */
  children?: ReactNode;

  /**
   * Controlled state for tooltip visibility
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled tooltip
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback when tooltip open state changes
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Override provider delay for this tooltip
   */
  delay?: number;

  /**
   * Override provider hide delay for this tooltip
   * @defaultValue 0
   */
  hideDelay?: number;

  /**
   * Whether tooltip is disabled
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Own props for TooltipTrigger
 */
export interface TooltipTriggerOwnProps {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: TooltipTriggerRenderProps) => ReactNode);
}

/**
 * Props for TooltipTrigger
 * @remarks The trigger element that shows/hides the tooltip
 */
export type TooltipTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  TooltipTriggerOwnProps
>;

/**
 * Own props for TooltipContent
 */
export interface TooltipContentOwnProps {
  /**
   * Whether tooltip provides primary label or auxiliary description
   * @defaultValue false
   */
  asLabel?: boolean;

  /**
   * Preferred placement relative to trigger
   * @defaultValue 'top'
   */
  side?: Side;

  /**
   * Distance in pixels from the trigger
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Alignment relative to trigger
   * @defaultValue 'center'
   */
  align?: Align;

  /**
   * Offset for alignment
   * @defaultValue 0
   */
  alignOffset?: number;

  /**
   * Whether to avoid viewport collisions
   * @defaultValue true
   */
  avoidCollisions?: boolean;

  /**
   * Collision boundary elements
   */
  collisionBoundary?: Element | Element[];

  /**
   * Padding for collision detection
   * @defaultValue 8
   */
  collisionPadding?: number | Partial<Record<Side, number>>;

  /**
   * Sticky behavior during scroll
   * @defaultValue 'partial'
   */
  sticky?: Sticky;

  /**
   * Hide when trigger becomes detached
   * @defaultValue false
   */
  hideWhenDetached?: boolean;

  /**
   * Escape key handler
   * @param event - The keyboard event (call preventDefault to prevent close)
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside pointer down handler
   * @param event - The pointer event (call preventDefault to prevent close)
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Called when auto-focusing on open
   * @param event - The focus event (call preventDefault to prevent auto-focus)
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Called when auto-focusing on close
   * @param event - The focus event (call preventDefault to prevent focus restore)
   */
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Props for TooltipContent
 * @remarks The content that displays in the tooltip
 */
export type TooltipContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  TooltipContentOwnProps
>;

/**
 * Props for TooltipPortal
 * @remarks Portal component for rendering tooltip outside normal DOM tree
 */
export interface TooltipPortalProps {
  /**
   * Content to render in portal
   */
  children?: ReactNode;

  /**
   * Portal container element
   * @defaultValue document.body
   */
  container?: HTMLElement;

  /**
   * Force mount regardless of open state
   * @defaultValue false
   */
  forceMount?: boolean;
}

/**
 * Own props for TooltipArrow
 */
export interface TooltipArrowOwnProps {
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
}

/**
 * Props for TooltipArrow
 * @remarks Optional arrow pointing to the trigger element
 */
export type TooltipArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<
  'svg',
  T,
  TooltipArrowOwnProps
>;

// Internal context types

/**
 * @internal
 */
export interface TooltipContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  delay: number;
  hideDelay: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  triggerId: string;
  contentId: string;
  asLabel: boolean;
  placement: Side;
  setPlacement: (placement: Side) => void;
  disabled: boolean;
  // Floating UI refs
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<HTMLElement | SVGSVGElement | null>;
  // Timeout control for hoverable content
  hideTimeoutRef: RefObject<number | null>;
  clearHideTimeout: () => void;
}

/**
 * @internal
 */
export interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  isOpenDelayed: boolean;
  setIsOpenDelayed: (open: boolean) => void;
}

/**
 * @internal
 */
export interface TooltipState {
  isOpen: boolean;
  hovering: boolean;
  focused: boolean;
  hoveringTooltip: boolean;
  showTimeoutId: number | null;
  hideTimeoutId: number | null;
}
