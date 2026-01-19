import type { ComponentProps, ReactNode, ElementType, RefObject, SVGProps } from 'react';
import { Side, Align } from '../../types';

export type Sticky = 'partial' | 'always';

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
 * Props for TooltipRoot
 * @remarks Root component that manages tooltip state
 */
export interface TooltipRootProps {
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
 * Props for TooltipTrigger
 * @remarks The trigger element that shows/hides the tooltip
 */
export interface TooltipTriggerProps extends ComponentProps<'button'> {
  /**
   * The trigger element (must be single focusable element)
   */
  children?: ReactNode;

  /**
   * Compose with child element instead of rendering button
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Element type when not using asChild
   * @defaultValue 'button'
   */
  as?: ElementType;
}

/**
 * Props for TooltipContent
 * @remarks The content that displays in the tooltip
 */
export interface TooltipContentProps extends ComponentProps<'div'> {
  /**
   * Element type for tooltip content container
   * @defaultValue 'div'
   */
  as?: ElementType;

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
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside pointer down handler
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Called when auto-focusing on open
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Called when auto-focusing on close
   */
  onCloseAutoFocus?: (event: Event) => void;
}

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
 * Props for TooltipArrow
 * @remarks Optional arrow pointing to the trigger element
 */
export interface TooltipArrowProps extends SVGProps<SVGSVGElement> {
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
   * Element type for arrow
   * @defaultValue 'svg'
   */
  as?: ElementType;
}

// Internal context types
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

export interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  isOpenDelayed: boolean;
  setIsOpenDelayed: (open: boolean) => void;
}

export interface TooltipState {
  isOpen: boolean;
  hovering: boolean;
  focused: boolean;
  hoveringTooltip: boolean;
  showTimeoutId: number | null;
  hideTimeoutId: number | null;
}
