import type {
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
  AriaAttributes,
  AriaRole,
} from 'react';

// Core Toast Types with const assertions for better performance
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastSize = 'small' | 'medium' | 'large';

export type ToastPriority = 'low' | 'normal' | 'high';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export type ToastState = 'closed' | 'opening' | 'open' | 'closing';

// Swipe gesture types
export interface SwipeCoordinates {
  readonly x: number;
  readonly y: number;
}

export interface SwipeEvent {
  readonly startCoordinates: SwipeCoordinates;
  readonly currentCoordinates: SwipeCoordinates;
  readonly direction: SwipeDirection | null;
  readonly distance: number;
  readonly velocity: number;
  readonly timestamp: number;
}

export interface SwipeGestureConfig {
  readonly threshold?: number; // minimum distance to trigger swipe (default: 50)
  readonly velocityThreshold?: number; // minimum velocity to trigger swipe (default: 0.3)
  readonly preventScroll?: boolean; // prevent default scroll behavior (default: true)
  readonly enableMouse?: boolean; // enable mouse swipe gestures (default: true)
  readonly enableTouch?: boolean; // enable touch swipe gestures (default: true)
}

// Utility types for better type safety
export type RequiredToastConfig = Required<
  Pick<ToastConfig, 'variant' | 'size' | 'priority' | 'isPersistent' | 'isLoading'>
>;

export type OptionalToastConfig = Partial<Pick<ToastConfig, 'duration' | 'progress'>>;

// Priority order mapping type for better performance
export type PriorityOrder = Record<ToastPriority, number>;

// Timer type for cross-platform compatibility
export type TimerId = ReturnType<typeof setTimeout>;

// Toast Configuration with improved types
export interface ToastConfig {
  readonly variant?: ToastVariant;
  readonly size?: ToastSize;
  readonly duration?: number;
  readonly priority?: ToastPriority;
  readonly isPersistent?: boolean;
  readonly isLoading?: boolean;
  readonly progress?: number;
  readonly onSwipeStart?: (direction: SwipeDirection) => void;
  readonly onSwipeEnd?: (direction: SwipeDirection) => void;
  readonly swipeThreshold?: number;
}

// Context Types with improved performance and type safety
export interface ToastItem extends RequiredToastConfig {
  readonly id: string;
  readonly open: boolean;
  readonly content: ReactNode;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly duration?: number;
  readonly progress?: number;
}

// Enhanced context value with queue management
export interface ToastContextValue {
  readonly toasts: readonly ToastItem[]; // Visible toasts only
  readonly allToasts: readonly ToastItem[]; // All toasts including queued
  readonly queuedToasts: readonly ToastItem[]; // Queued (hidden) toasts
  readonly addToast: (config: ToastConfig & { content: ReactNode }) => string;
  readonly removeToast: (id: string) => void;
  readonly updateToast: (id: string, updates: Partial<ToastItem>) => void;
  readonly pauseAll: () => void;
  readonly resumeAll: () => void;
  readonly clearAll: () => void;
  readonly config: Required<ToastProviderProps>;
}

// Component Props Interfaces

/**
 * Props for ToastProvider
 * @remarks Global toast management and configuration
 */
export interface ToastProviderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Ref for the provider element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Maximum number of toasts in memory (queue limit)
   * @defaultValue 5
   */
  maxToasts?: number;

  /**
   * Maximum number of toasts visible at once (others queued)
   * @defaultValue 3
   */
  visibleLimit?: number;

  /**
   * Global positioning for toast container
   * @defaultValue 'top-right'
   */
  position?: ToastPosition;

  /**
   * Default auto-dismiss timeout in ms (0 disables)
   * @defaultValue 5000
   */
  duration?: number;

  /**
   * Pause auto-dismiss when hovering
   * @defaultValue true
   */
  shouldPauseOnHover?: boolean;

  /**
   * Pause auto-dismiss when focused
   * @defaultValue true
   */
  shouldPauseOnFocus?: boolean;

  /**
   * Swipe direction for dismissal
   * @defaultValue 'right'
   */
  swipeDirection?: SwipeDirection;

  /**
   * Auto-close when swipe gesture completes
   * @defaultValue true
   */
  shouldCloseOnSwipeEnd?: boolean;

  /**
   * Provider content
   */
  children: ReactNode;
}

/**
 * Props for ToastRoot
 * @remarks Core toast container with state management
 */
export interface ToastRootProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Ref for the root element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Toast semantic variant
   * @defaultValue 'info'
   */
  variant?: ToastVariant;

  /**
   * Toast size variant
   * @defaultValue 'medium'
   */
  size?: ToastSize;

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Uncontrolled default open state
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Open state change handler
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Override provider duration
   */
  duration?: number;

  /**
   * Called when duration expires
   */
  onDurationEnd?: () => void;

  /**
   * Queue priority level
   * @defaultValue 'normal'
   */
  priority?: ToastPriority;

  /**
   * Prevents auto-dismiss
   * @defaultValue false
   */
  persistent?: boolean;

  /**
   * Shows loading state with progress
   * @defaultValue false
   */
  loading?: boolean;

  /**
   * Loading progress (0-100)
   */
  progress?: number;

  /**
   * Swipe gesture start handler
   */
  onSwipeStart?: (direction: SwipeDirection) => void;

  /**
   * Swipe gesture end handler
   */
  onSwipeEnd?: (direction: SwipeDirection) => void;

  /**
   * Swipe gesture threshold distance in pixels
   * @defaultValue 50
   */
  swipeThreshold?: number;

  /**
   * ARIA role for the toast element
   */
  role?: AriaRole;

  /**
   * Live region politeness setting
   */
  'aria-live'?: AriaAttributes['aria-live'];

  /**
   * Whether screen readers should read the entire region
   */
  'aria-atomic'?: AriaAttributes['aria-atomic'];

  /**
   * Indicates if the element is currently busy/loading
   */
  'aria-busy'?: AriaAttributes['aria-busy'];

  /**
   * Hides the element from screen readers when closed
   */
  'aria-hidden'?: AriaAttributes['aria-hidden'];

  /**
   * Accessible label for the toast
   */
  'aria-label'?: AriaAttributes['aria-label'];

  /**
   * Associated label element ID
   */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];

  /**
   * Associated description element ID
   */
  'aria-describedby'?: AriaAttributes['aria-describedby'];

  /**
   * Root content
   */
  children?: ReactNode;
}

/**
 * Props for ToastContent
 * @remarks Content wrapper for toast body
 */
export interface ToastContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Ref for the content element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Content
   */
  children?: ReactNode;
}

/**
 * Props for ToastTitle
 * @remarks Accessible heading for toast
 */
export interface ToastTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Ref for the title element
   */
  ref?: Ref<HTMLHeadingElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'h3'
   */
  as?: ElementType;

  /**
   * Heading level for accessibility
   * @defaultValue 3
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Title content
   */
  children?: ReactNode;
}

/**
 * Props for ToastDescription
 * @remarks Descriptive text content
 */
export interface ToastDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * Ref for the description element
   */
  ref?: Ref<HTMLParagraphElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'p'
   */
  as?: ElementType;

  /**
   * Description content
   */
  children?: ReactNode;
}

/**
 * Props for ToastAction
 * @remarks Interactive action button
 */
export interface ToastActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Ref for the action element
   */
  ref?: Ref<HTMLButtonElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Alternative action text for accessibility
   */
  altText: string;

  /**
   * Accessible label - use React's built-in ARIA type
   */
  'aria-label'?: AriaAttributes['aria-label'];

  /**
   * Associated description element ID
   */
  'aria-describedby'?: AriaAttributes['aria-describedby'];

  /**
   * Action content
   */
  children?: ReactNode;
}

/**
 * Props for ToastClose
 * @remarks Close/dismiss button
 */
export interface ToastCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Ref for the close element
   */
  ref?: Ref<HTMLButtonElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Click handler for close action
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Accessible label for close button
   */
  'aria-label'?: AriaAttributes['aria-label'];

  /**
   * Close button content
   */
  children?: ReactNode;
}

/**
 * Props for ToastIcon
 * @remarks Icon indicator for variants
 */
export interface ToastIconProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Ref for the icon element
   */
  ref?: Ref<HTMLSpanElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Hides decorative icons from screen readers
   * @defaultValue 'true'
   */
  'aria-hidden'?: AriaAttributes['aria-hidden'];

  /**
   * Icon content
   */
  children?: ReactNode;
}

/**
 * Props for ToastProgress
 * @remarks Progress indicator for loading states
 */
export interface ToastProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Ref for the progress element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Polymorphic element type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Progress value (0-100)
   */
  value?: number;

  /**
   * Maximum progress value
   * @defaultValue 100
   */
  max?: number;

  /**
   * Accessible label for progress bar
   */
  'aria-label'?: AriaAttributes['aria-label'];

  /**
   * Element ID describing the progress
   */
  'aria-describedby'?: AriaAttributes['aria-describedby'];

  /**
   * Current progress value for screen readers
   */
  'aria-valuenow'?: AriaAttributes['aria-valuenow'];

  /**
   * Minimum progress value
   */
  'aria-valuemin'?: AriaAttributes['aria-valuemin'];

  /**
   * Maximum progress value
   */
  'aria-valuemax'?: AriaAttributes['aria-valuemax'];

  /**
   * Progress content
   */
  children?: ReactNode;
}

// Utility Types
export interface UseToastReturn {
  addToast: ToastContextValue['addToast'];
  removeToast: ToastContextValue['removeToast'];
  updateToast: ToastContextValue['updateToast'];
  clearAll: ToastContextValue['clearAll'];
  toasts: ToastContextValue['toasts']; // Visible toasts
  allToasts: ToastContextValue['allToasts']; // All toasts including queued
  queuedToasts: ToastContextValue['queuedToasts']; // Queued toasts
  
  // Convenience functions with duration override support
  toast: (content: ReactNode, config?: ToastConfig) => string;
  success: (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) => string;
  error: (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) => string;
  warning: (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) => string;
  info: (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) => string;
  loading: (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) => string;
  
  // Duration-specific shortcuts
  quick: (content: ReactNode, config?: ToastConfig) => string;
  long: (content: ReactNode, config?: ToastConfig) => string;
  persistent: (content: ReactNode, config?: ToastConfig) => string;
  
  remove: (id: string) => void;
  update: (id: string, updates: Partial<ToastItem>) => void;
  clear: () => void;
}

export interface UseToastStateReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  timeRemaining: number;
}
