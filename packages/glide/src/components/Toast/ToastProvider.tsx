import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  startTransition,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import type { ToastProviderProps, ToastContextValue, ToastItem, ToastConfig } from './Toast.types';
import {
  TOAST_DEFAULT_DURATION,
  TOAST_MAX_COUNT,
  TOAST_VISIBLE_LIMIT,
  PRIORITY_ORDER,
} from './constants';
import { generateToastId, sortToastQueue, getVisibleToasts } from './utils';

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
  visibleLimit = TOAST_VISIBLE_LIMIT,
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

  const config = useMemo(
    () => ({
      maxToasts,
      visibleLimit,
      position,
      duration,
      shouldPauseOnHover,
      shouldPauseOnFocus,
      swipeDirection,
      shouldCloseOnSwipeEnd,
    }),
    [
      maxToasts,
      visibleLimit,
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
        duration: toastConfig.duration ?? duration, // Use provider default if not specified
        ...(toastConfig.progress !== undefined && { progress: toastConfig.progress }),
      };

      startTransition(() => {
        setToasts((prevToasts) => {
          let updatedToasts = [...prevToasts, newToast];

          // Remove oldest low priority toast if we exceed maxToasts limit
          if (updatedToasts.length > maxToasts) {
            // Sort by priority DESC, createdAt ASC to find least important toast
            updatedToasts.sort((a, b) => sortToastQueue(a, b, PRIORITY_ORDER));
            updatedToasts = updatedToasts.slice(0, maxToasts);
          }

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
    // Pause functionality - implementation can be added later if needed
  }, []);

  const resumeAll = useCallback((): void => {
    // Resume functionality - implementation can be added later if needed
  }, []);

  const clearAll = useCallback((): void => {
    setToasts([]);
  }, [setToasts]);

  // Calculate visible and queued toasts
  const { visible: visibleToasts, queued: queuedToasts } = useMemo(
    () => getVisibleToasts(toasts, visibleLimit, PRIORITY_ORDER),
    [toasts, visibleLimit],
  );

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts: visibleToasts, // Only expose visible toasts to viewport
      allToasts: toasts, // All toasts for internal management
      queuedToasts,
      addToast,
      removeToast,
      updateToast,
      pauseAll,
      resumeAll,
      clearAll,
      config: config as Required<ToastProviderProps>,
    }),
    [
      toasts,
      visibleToasts,
      queuedToasts,
      addToast,
      removeToast,
      updateToast,
      pauseAll,
      resumeAll,
      clearAll,
      config,
    ],
  );

  // Global toast event listener'ları
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleToastEvent = (event: CustomEvent) => {
      const { content, config: eventConfig } = event.detail;
      // Duration resolution: event config > provider default
      const resolvedConfig = {
        ...eventConfig,
        duration: eventConfig?.duration ?? duration,
      };
      const id = addToast({ content, ...resolvedConfig });
      event.detail.id = id;
    };

    const handleRemoveEvent = (event: CustomEvent) => {
      const { id } = event.detail;
      removeToast(id);
    };

    window.addEventListener('glide-toast', handleToastEvent as EventListener);
    window.addEventListener('glide-toast-remove', handleRemoveEvent as EventListener);

    return () => {
      window.removeEventListener('glide-toast', handleToastEvent as EventListener);
      window.removeEventListener('glide-toast-remove', handleRemoveEvent as EventListener);
    };
  }, [addToast, removeToast]);

  return (
    <div ref={ref} {...props}>
      <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
    </div>
  );
};

ToastProvider.displayName = 'Toast.Provider';
