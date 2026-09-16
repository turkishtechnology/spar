import type { ElementType, ReactNode, RefObject } from 'react';
import type { Side, Align, PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

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
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger` and `${id}-content`.
   */
  id?: string;

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
export interface TooltipTriggerOwnProps extends ButtonOwnProps {
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
   * Preferred placement relative to trigger
   * @defaultValue 'top'
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
   * Called when `Escape` is pressed while the tooltip is open, whether focus is on the
   * trigger, inside the content, or elsewhere in the document. Runs before the internal
   * close so the consumer can veto it.
   * @param event - The native keyboard event (call `preventDefault` to keep the tooltip open)
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
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
 * Props for TooltipArrow
 * @remarks Optional arrow pointing to the trigger element. Headless: user provides all visuals.
 */
export type TooltipArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<'svg', T>;

/**
 * @internal
 */
export interface TooltipContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  delay: number;
  hideDelay: number;
  disableHoverableContent: boolean;
  triggerId: string;
  contentId: string;
  disabled: boolean;
  // Floating UI refs
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<Element | null>;
  // Hide timer control for hoverable content (WCAG 1.4.13)
  startHideTimer: (delayMs: number, callback: () => void) => void;
  cancelHideTimer: () => void;
  // Latest TooltipContent onEscapeKeyDown, read by the trigger's Escape handlers
  onEscapeKeyDownRef: RefObject<((event: KeyboardEvent) => void) | undefined>;
}

/**
 * @internal
 */
export interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  skipDelay: boolean;
  setSkipDelay: (value: boolean) => void;
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
