import { useCallback, useRef, useEffect, useState } from 'react';
import type { TimerId } from './types';

/**
 * Optimized hook for managing toast timers with proper cleanup
 */
export function useToastTimer(
  callback: () => void,
  delay: number,
  enabled: boolean = true,
): {
  start: () => void;
  stop: () => void;
  restart: () => void;
} {
  const timerRef = useRef<TimerId | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (enabled && delay > 0) {
      timerRef.current = setTimeout(() => {
        callbackRef.current();
        timerRef.current = null;
      }, delay);
    }
  }, [delay, enabled, stop]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  // Cleanup on unmount
  useEffect(() => {
    return stop;
  }, [stop]);

  return { start, stop, restart };
}

/**
 * Optimized hook for stable object references
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    [],
  );
}

/**
 * Performance-optimized event handler hook
 */
export function useEventHandler<T extends Event>(
  handler: ((event: T) => void) | undefined,
  dependencies: unknown[] = [],
): ((event: T) => void) | undefined {
  return useCallback(
    handler
      ? (event: T) => {
          event.preventDefault?.();
          handler(event);
        }
      : undefined,
    [handler, ...dependencies],
  );
}

/**
 * Optimized hook for managing component visibility state
 */
export function useVisibility(initialVisible: boolean = false): {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
} {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((prev: boolean) => !prev), []);

  return { isVisible, show, hide, toggle };
}

/**
 * Performance hook for batching state updates
 */
export function useBatchedState<T>(
  initialState: T,
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const [state, setState] = useState(initialState);

  const batchedSetState = useCallback((updates: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState((prevState: T) => {
      const resolvedUpdates = typeof updates === 'function' ? updates(prevState) : updates;
      return { ...prevState, ...resolvedUpdates };
    });
  }, []);

  return [state, batchedSetState];
}
