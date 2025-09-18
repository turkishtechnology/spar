// @ts-nocheck - Temporary workaround for React type issues

// Import types from our custom React declarations
type ElementType = unknown;
type ReactNode = unknown;
type HTMLAttributes = Record<string, unknown>;
type ButtonHTMLAttributes = Record<string, unknown>;
type MouseEvent = Event;
type Ref = { current: unknown | null };

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
}

// Context Types with improved performance and type safety
export interface ToastItem extends RequiredToastConfig {
  readonly id: string;
  readonly isOpen: boolean;
  readonly content: ReactNode;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly duration?: number;
  readonly progress?: number;
}

// Enhanced context value with better method signatures
export interface ToastContextValue {
  readonly toasts: readonly ToastItem[];
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
   * Maximum number of toasts visible at once
   * @defaultValue 5
   */
  maxToasts?: number;

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
  isOpen?: boolean;

  /**
   * Uncontrolled default open state
   * @defaultValue false
   */
  defaultIsOpen?: boolean;

  /**
   * Open state change handler
   */
  onOpenChange?: (isOpen: boolean) => void;

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
  isPersistent?: boolean;

  /**
   * Shows loading state with progress
   * @defaultValue false
   */
  isLoading?: boolean;

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
  toasts: ToastContextValue['toasts'];
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
