import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import type { ToastRootProps, TimerId, SwipeEvent } from './Toast.types';
import { useToastContext } from './ToastProvider';
import { getAriaRole, getAriaLive } from './utils';
import { useSwipeGesture } from './useSwipeGesture';

/**
 * Hook for controllable state pattern
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
 * Toast Root with state and accessibility management.
 */
export const ToastRoot = ({
  ref,
  as: Component = 'div',
  variant = 'info',
  size = 'medium',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  duration: durationProp,
  onDurationEnd,
  priority: _priority = 'normal',
  persistent = false,
  loading = false,
  progress: _progress,
  onSwipeStart,
  onSwipeEnd,
  swipeThreshold = 50,
  children,
  ...props
}: ToastRootProps) => {
  const { config } = useToastContext();
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerId = useRef<TimerId | null>(null);

  const duration = durationProp ?? config.duration;

  // Simple ARIA attributes - React 19+ auto-optimizes
  const ariaRole = getAriaRole(variant);
  const ariaLive = getAriaLive(variant);

  // Enhanced timer management with remaining time tracking
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const startTime = useRef<number>(0);
  
  const clearTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    
    if (!open || persistent || duration <= 0 || loading) {
      return;
    }

    const remainingTime = isPaused ? timeRemaining : duration;
    startTime.current = Date.now();
    setTimeRemaining(remainingTime);

    timerId.current = setTimeout(() => {
      setOpen(false);
      onDurationEnd?.();
      timerId.current = null;
    }, remainingTime);
  }, [open, persistent, duration, loading, isPaused, timeRemaining, onDurationEnd, setOpen, clearTimer]);

  // Timer lifecycle management
  useEffect(() => {
    if (isPaused) {
      // Pause: Calculate remaining time
      if (timerId.current && startTime.current > 0) {
        const elapsed = Date.now() - startTime.current;
        const remaining = Math.max(0, timeRemaining - elapsed);
        setTimeRemaining(remaining);
        clearTimer();
      }
    } else {
      // Resume or start
      startTimer();
    }

    return clearTimer;
  }, [open, persistent, duration, loading, isPaused, startTimer, clearTimer]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  // Event handlers
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
        setOpen(false);
        onDurationEnd?.(); // Notify parent that toast should be closed
      }
    },
    [setOpen, onDurationEnd],
  );

  // Swipe gesture handlers
  const handleSwipeStart = useCallback((swipeEvent: SwipeEvent) => {
    // Pause timer during swipe
    setIsPaused(true);
    onSwipeStart?.(swipeEvent.direction!);
  }, [onSwipeStart]);

  const handleSwipeMove = useCallback((swipeEvent: SwipeEvent) => {
    // Could add visual feedback here for swipe progress
    // For now, we just track the swipe movement
  }, []);

  const handleSwipeEnd = useCallback((swipeEvent: SwipeEvent) => {
    // Resume timer after swipe
    setIsPaused(false);
    
    if (swipeEvent.direction) {
      onSwipeEnd?.(swipeEvent.direction);
      
      // Auto-dismiss on successful swipe
      setOpen(false);
      onDurationEnd?.();
    }
  }, [onSwipeEnd, setOpen, onDurationEnd]);

  const handleSwipeCancel = useCallback(() => {
    // Resume timer if swipe was cancelled
    setIsPaused(false);
  }, []);

  // Initialize swipe gesture hook
  const { isSwping, currentSwipe, handlers } = useSwipeGesture({
    threshold: swipeThreshold,
    velocityThreshold: 0.3,
    preventScroll: true,
    enableMouse: true,
    enableTouch: true,
    onSwipeStart: handleSwipeStart,
    onSwipeMove: handleSwipeMove,
    onSwipeEnd: handleSwipeEnd,
    onSwipeCancel: handleSwipeCancel,
  });

  return (
    <Component
      ref={ref}
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic='true'
      aria-busy={loading}
      aria-hidden={!open}
      tabIndex={0}
      data-toast-root
      data-state={open ? 'open' : 'closed'}
      data-variant={variant}
      data-size={size}
      data-paused={isPaused}
      data-loading={loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseDown={handlers.onMouseDown}
      onTouchStart={handlers.onTouchStart}
      data-swping={isSwping}
      data-swipe-direction={currentSwipe?.direction || null}
      {...props}
    >
      {children}
    </Component>
  );
};

ToastRoot.displayName = 'Toast.Root';
