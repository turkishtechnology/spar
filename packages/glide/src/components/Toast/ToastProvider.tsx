import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  startTransition,
  useState,
  type ReactNode,
} from 'react';

import type { ToastProviderProps, ToastContextValue, ToastItem, ToastConfig } from './Toast.types';
import { TOAST_DEFAULT_DURATION, TOAST_MAX_COUNT, PRIORITY_ORDER } from './constants';
import { generateToastId, sortByPriority } from './utils';

// Context
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to access Toast context with error handling
 */
export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'Toast components must be used within ToastProvider. ' +
        'Wrap your component tree with <ToastProvider>.',
    );
  }

  return context;
};

/**
 * Toast Provider with context and state management.
 */
export const ToastProvider = ({
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
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  const addToast = useCallback(
    (toastConfig: ToastConfig & { content: ReactNode }): string => {
      const id = generateToastId();

      const newToast: ToastItem = {
        id,
        open: true,
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
        setToasts((prevToasts) => {
          const updatedToasts = [...prevToasts];

          if (updatedToasts.length >= maxToasts) {
            updatedToasts.sort((a, b) => sortByPriority(a, b, PRIORITY_ORDER));
            updatedToasts.shift();
          }

          updatedToasts.push(newToast);
          return updatedToasts;
        });
      });

      return id;
    },
    [maxToasts, setToasts],
  );

  const removeToast = useCallback(
    (id: string): void => {
      startTransition(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
      });
    },
    [setToasts],
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<ToastItem>): void => {
      startTransition(() => {
        setToasts((prevToasts) =>
          prevToasts.map((toast) =>
            toast.id === id ? { ...toast, ...updates, updatedAt: Date.now() } : toast,
          ),
        );
      });
    },
    [setToasts],
  );

  const pauseAll = useCallback((): void => {
    setIsPaused(true);
  }, [setIsPaused]);

  const resumeAll = useCallback((): void => {
    setIsPaused(false);
  }, [setIsPaused]);

  const clearAll = useCallback((): void => {
    startTransition(() => {
      setToasts([]);
      setIsPaused(false);
    });
  }, [setToasts, setIsPaused]);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
      updateToast,
      pauseAll,
      resumeAll,
      clearAll,
      config: config as Required<ToastProviderProps>,
    }),
    [toasts, addToast, removeToast, updateToast, pauseAll, resumeAll, clearAll, config],
  );

  return (
    <div ref={ref} {...props}>
      <ToastContext.Provider value={contextValue}>
        {children}
        <div data-toast-viewport data-position={position} data-paused={isPaused}>
          {toasts.map((toast: ToastItem) => (
            <div
              key={toast.id}
              data-toast-item
              data-variant={toast.variant}
              data-size={toast.size}
              data-state={toast.open ? 'open' : 'closed'}
            >
              {toast.content}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </div>
  );
};

ToastProvider.displayName = 'Toast.Provider';
