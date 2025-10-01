import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import type { ToastRootProps, TimerId } from './Toast.types';
import { useToastContext } from './ToastProvider';
import { getAriaRole, getAriaLive } from './utils';

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
  onSwipeStart: _onSwipeStart,
  onSwipeEnd: _onSwipeEnd,
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

  // Timer management
  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }

    if (!open || persistent || duration <= 0 || isPaused) {
      return;
    }

    timerId.current = setTimeout(() => {
      setOpen(false);
      onDurationEnd?.();
    }, duration);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null;
      }
    };
  }, [open, persistent, duration, isPaused, onDurationEnd, setOpen]);

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
      {...props}
    >
      {children}
    </Component>
  );
};

ToastRoot.displayName = 'Toast.Root';
