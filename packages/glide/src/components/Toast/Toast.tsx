import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  memo,
  startTransition,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
  type ElementType,
} from 'react';

import type {
  ToastProviderProps,
  ToastRootProps,
  ToastContentProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
  ToastIconProps,
  ToastProgressProps,
  ToastContextValue,
  ToastItem,
  ToastConfig,
  PriorityOrder,
  TimerId,
} from './types';
import { useStableCallback, useBatchedState } from './hooks';

// Constants - move to external file for better tree-shaking
const TOAST_DEFAULT_DURATION = 5000 as const;
const TOAST_MAX_COUNT = 5 as const;

// Optimized ID generation with better performance
let toastIdCounter = 0;
const generateToastId = (): string => {
  toastIdCounter = (toastIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${toastIdCounter}-${Date.now()}`;
};

// Context
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Optimized hook to access Toast context with error handling and debugging info
 */
const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'Toast components must be used within ToastProvider. ' +
        'Wrap your component tree with <ToastProvider>.',
    );
  }

  return context as ToastContextValue;
};

/**
 * Optimized hook for controllable state pattern with better performance
 */
function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (value: T | ((prev: T) => T)) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof newValue === 'function' ? (newValue as (prev: T) => T)(currentValue) : newValue;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }
      onChange?.(resolvedValue);
    },
    [isControlled, onChange, currentValue],
  );

  return [currentValue, setValue] as const;
}

/**
 * Optimized Toast Provider with better performance and state management.
 * Uses React 19+ patterns and optimized state updates.
 */
export const ToastProvider = memo(
  ({
    ref,
    maxToasts = TOAST_MAX_COUNT,
    position = 'top-right',
    duration = TOAST_DEFAULT_DURATION,
    shouldPauseOnHover = true,
    shouldPauseOnFocus = true,
    swipeDirection = 'right',
    shouldCloseOnSwipeEnd = true,
    children,
    ...props
  }: ToastProviderProps) => {
    // Use batched state for better performance
    const [state, setState] = useBatchedState<{
      toasts: ToastItem[];
      isPaused: boolean;
    }>({
      toasts: [],
      isPaused: false,
    });

    // Memoize config to prevent unnecessary re-renders
    const config = useMemo(
      () => ({
        maxToasts,
        position,
        duration,
        shouldPauseOnHover,
        shouldPauseOnFocus,
        swipeDirection,
        shouldCloseOnSwipeEnd,
      }),
      [
        maxToasts,
        position,
        duration,
        shouldPauseOnHover,
        shouldPauseOnFocus,
        swipeDirection,
        shouldCloseOnSwipeEnd,
      ],
    );

    // Optimized addToast with priority-based insertion
    const addToast = useStableCallback(
      (toastConfig: ToastConfig & { content: ReactNode }): string => {
        const id = generateToastId();

        const newToast: ToastItem = {
          id,
          isOpen: true,
          content: toastConfig.content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          variant: toastConfig.variant ?? 'info',
          size: toastConfig.size ?? 'medium',
          priority: toastConfig.priority ?? 'normal',
          isPersistent: toastConfig.isPersistent ?? false,
          isLoading: toastConfig.isLoading ?? false,
          ...(toastConfig.duration !== undefined && { duration: toastConfig.duration }),
          ...(toastConfig.progress !== undefined && { progress: toastConfig.progress }),
        };

        startTransition(() => {
          setState((prevState) => {
            const updatedToasts = [...prevState.toasts];

            // Priority-based insertion and queue management
            if (updatedToasts.length >= maxToasts) {
              const priorityOrder: PriorityOrder = { low: 0, normal: 1, high: 2 };
              updatedToasts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
              updatedToasts.shift(); // Remove lowest priority
            }

            updatedToasts.push(newToast);
            return { toasts: updatedToasts };
          });
        });

        return id;
      },
    );

    // Optimized removeToast with startTransition
    const removeToast = useStableCallback((id: string): void => {
      startTransition(() => {
        setState((prevState) => ({
          toasts: prevState.toasts.filter((toast) => toast.id !== id),
        }));
      });
    });

    // Batch update optimization
    const updateToast = useStableCallback((id: string, updates: Partial<ToastItem>): void => {
      startTransition(() => {
        setState((prevState) => ({
          toasts: prevState.toasts.map((toast) =>
            toast.id === id ? { ...toast, ...updates, updatedAt: Date.now() } : toast,
          ),
        }));
      });
    });

    // Optimized pause/resume with state management
    const pauseAll = useStableCallback((): void => {
      setState({ isPaused: true });
    });

    const resumeAll = useStableCallback((): void => {
      setState({ isPaused: false });
    });

    const clearAll = useStableCallback((): void => {
      startTransition(() => {
        setState({ toasts: [], isPaused: false });
      });
    });

    // Optimized context value with stable reference
    const contextValue = useMemo<ToastContextValue>(
      () => ({
        toasts: state.toasts,
        addToast,
        removeToast,
        updateToast,
        pauseAll,
        resumeAll,
        clearAll,
        config: config as Required<ToastProviderProps>,
      }),
      [state.toasts, addToast, removeToast, updateToast, pauseAll, resumeAll, clearAll, config],
    );

    return (
      <div ref={ref} {...props}>
        <ToastContext.Provider value={contextValue}>
          {children}
          <div data-toast-viewport data-position={position}>
            {state.toasts.map((toast: ToastItem) => (
              <div
                key={toast.id}
                data-toast-item
                data-variant={toast.variant}
                data-size={toast.size}
                data-state={toast.isOpen ? 'open' : 'closed'}
              >
                {toast.content}
              </div>
            ))}
          </div>
        </ToastContext.Provider>
      </div>
    );
  },
);

/**
 * Optimized Toast Root component with better performance and accessibility.
 * Uses React 19+ patterns and memoized event handlers.
 */
export const ToastRoot = memo(
  ({
    ref,
    as: Component = 'div',
    variant = 'info',
    size = 'medium',
    isOpen: isOpenProp,
    defaultIsOpen = false,
    onOpenChange,
    duration: durationProp,
    onDurationEnd,
    priority: _priority = 'normal',
    isPersistent = false,
    isLoading = false,
    progress: _progress,
    onSwipeStart: _onSwipeStart,
    onSwipeEnd: _onSwipeEnd,
    children,
    ...props
  }: ToastRootProps) => {
    const { config } = useToastContext();
    const [isOpen, setIsOpen] = useControllableState(isOpenProp, defaultIsOpen, onOpenChange);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timerId = useRef<TimerId | null>(null);

    const duration = durationProp ?? config.duration;

    // Memoized ARIA role calculation
    const ariaRole = useMemo((): string => {
      switch (variant) {
        case 'error':
          return 'alert';
        case 'loading':
          return 'log';
        default:
          return 'status';
      }
    }, [variant]);

    // Memoized ARIA live calculation
    const ariaLive = useMemo((): 'assertive' | 'polite' => {
      switch (variant) {
        case 'error':
        case 'warning':
          return 'assertive';
        default:
          return 'polite';
      }
    }, [variant]);

    // Optimized timer management with cleanup
    useEffect(() => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }

      if (!isOpen || isPersistent || duration <= 0 || isPaused) {
        return;
      }

      timerId.current = setTimeout(() => {
        setIsOpen(false);
        onDurationEnd?.();
      }, duration);

      return () => {
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null;
        }
      };
    }, [isOpen, isPersistent, duration, isPaused, onDurationEnd, setIsOpen]);

    // Memoized event handlers for better performance
    const handleMouseEnter = useCallback((): void => {
      if (config.shouldPauseOnHover) {
        setIsPaused(true);
      }
    }, [config.shouldPauseOnHover]);

    const handleMouseLeave = useCallback((): void => {
      if (config.shouldPauseOnHover) {
        setIsPaused(false);
      }
    }, [config.shouldPauseOnHover]);

    const handleFocus = useCallback((): void => {
      if (config.shouldPauseOnFocus) {
        setIsPaused(true);
      }
    }, [config.shouldPauseOnFocus]);

    const handleBlur = useCallback((): void => {
      if (config.shouldPauseOnFocus) {
        setIsPaused(false);
      }
    }, [config.shouldPauseOnFocus]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLElement>): void => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setIsOpen(false);
        }
      },
      [setIsOpen],
    );

    return (
      <Component
        ref={ref}
        role={ariaRole}
        aria-live={ariaLive}
        aria-atomic='true'
        aria-busy={isLoading}
        aria-hidden={!isOpen}
        data-toast-root
        data-state={isOpen ? 'open' : 'closed'}
        data-variant={variant}
        data-size={size}
        data-paused={isPaused}
        data-loading={isLoading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Content wrapper component.
 * Memoized for better performance with semantic structure.
 */
export const ToastContent = memo(
  ({ ref, as: Component = 'div', children, ...props }: ToastContentProps) => {
    return (
      <Component ref={ref} data-toast-content {...props}>
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Title component with semantic heading.
 * Memoized with optimized heading component selection.
 */
export const ToastTitle = memo(
  ({ ref, as: Component, level = 3, children, ...props }: ToastTitleProps) => {
    const HeadingComponent = useMemo(
      () => Component ?? (`h${level}` as ElementType),
      [Component, level],
    );

    return (
      <HeadingComponent ref={ref} data-toast-title {...props}>
        {children}
      </HeadingComponent>
    );
  },
);

/**
 * Optimized Toast Description component.
 * Memoized for better performance with descriptive text content.
 */
export const ToastDescription = memo(
  ({ ref, as: Component = 'p', children, ...props }: ToastDescriptionProps) => {
    return (
      <Component ref={ref} data-toast-description {...props}>
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Action button component.
 * Memoized with proper type handling for polymorphic components.
 */
export const ToastAction = memo(
  ({ ref, as: Component = 'button', altText, children, ...props }: ToastActionProps) => {
    const buttonType = useMemo(() => (Component === 'button' ? 'button' : undefined), [Component]);

    return (
      <Component ref={ref} type={buttonType} aria-label={altText} data-toast-action {...props}>
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Close button component.
 * Memoized with optimized click handling and accessibility.
 */
export const ToastClose = memo(
  ({ ref, as: Component = 'button', children, onClick, ...props }: ToastCloseProps) => {
    const buttonType = useMemo(() => (Component === 'button' ? 'button' : undefined), [Component]);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>): void => {
        onClick?.(event);
        // In real implementation, would close the toast
      },
      [onClick],
    );

    return (
      <Component
        ref={ref}
        type={buttonType}
        aria-label='Close notification'
        data-toast-close
        onClick={handleClick}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Icon component for variant indicators.
 * Memoized decorative icon element with proper accessibility attributes.
 */
export const ToastIcon = memo(
  ({ ref, as: Component = 'span', children, ...props }: ToastIconProps) => {
    return (
      <Component ref={ref} data-toast-icon aria-hidden='true' {...props}>
        {children}
      </Component>
    );
  },
);

/**
 * Optimized Toast Progress component for loading states.
 * Memoized accessible progress indicator with proper ARIA attributes.
 */
export const ToastProgress = memo(
  ({ ref, as: Component = 'div', value, max = 100, children, ...props }: ToastProgressProps) => {
    return (
      <Component
        ref={ref}
        role='progressbar'
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label='Loading progress'
        data-toast-progress
        data-progress={value}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

// Set display names for debugging and React DevTools
ToastProvider.displayName = 'Toast.Provider';
ToastRoot.displayName = 'Toast.Root';
ToastContent.displayName = 'Toast.Content';
ToastTitle.displayName = 'Toast.Title';
ToastDescription.displayName = 'Toast.Description';
ToastAction.displayName = 'Toast.Action';
ToastClose.displayName = 'Toast.Close';
ToastIcon.displayName = 'Toast.Icon';
ToastProgress.displayName = 'Toast.Progress';
