import type {
  CreateToasterOptions,
  ToastData,
  ToasterController,
  ToastOptions,
  ToastPromiseOptions,
  ToastType,
  ToastUpdateOptions,
} from './types';

const DEFAULT_DURATION = 5000;
const DEFAULT_REMOVE_DELAY = 200;
const DEFAULT_MAX_VISIBLE_TOASTS = 24;

const now = () => Date.now();

let idCounter = 0;

const defaultIdFactory = () => {
  idCounter += 1;
  return `toast-${idCounter}`;
};

const getDefaultAnnouncement = (type: ToastType) =>
  type === 'error' || type === 'warning' ? 'assertive' : 'polite';

export const createToaster = (options: CreateToasterOptions = {}): ToasterController => {
  const listeners = new Set<() => void>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const removeTimers = new Map<string, ReturnType<typeof setTimeout>>();
  let toasts: ToastData[] = [];
  let pageIdleCleanup: (() => void) | undefined;

  const placement = options.placement ?? 'bottom-end';
  const maxVisibleToasts = Math.max(1, options.maxVisibleToasts ?? DEFAULT_MAX_VISIBLE_TOASTS);
  const defaultDuration = options.duration ?? DEFAULT_DURATION;
  const removeDelay = options.removeDelay ?? DEFAULT_REMOVE_DELAY;
  const idFactory = options.idFactory ?? defaultIdFactory;

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  const clearTimer = (id: string) => {
    const timer = timers.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  };

  const clearRemoveTimer = (id: string) => {
    const timer = removeTimers.get(id);

    if (timer) {
      clearTimeout(timer);
      removeTimers.delete(id);
    }
  };

  const syncStatuses = () => {
    toasts = toasts.map((toast, index) => {
      if (toast.status === 'dismissing') {
        return toast;
      }

      const status = index < maxVisibleToasts ? 'visible' : 'queued';
      return toast.status === status ? toast : { ...toast, status };
    });
  };

  const visibleToastIds = () =>
    new Set(
      toasts
        .slice(0, maxVisibleToasts)
        .filter((toast) => toast.status === 'visible')
        .map((toast) => toast.id),
    );

  const pauseTimer = (toast: ToastData) => {
    const timer = timers.get(toast.id);

    if (!timer || toast.duration === null || toast.remaining === null) {
      clearTimer(toast.id);
      return toast;
    }

    const elapsed = now() - toast.createdAt;
    const remaining = Math.max(toast.remaining - elapsed, 0);

    clearTimer(toast.id);
    return { ...toast, remaining };
  };

  const scheduleTimer = (toast: ToastData) => {
    if (
      timers.has(toast.id) ||
      toast.duration === null ||
      toast.remaining === null ||
      toast.remaining <= 0
    ) {
      return toast;
    }

    const startedAt = now();
    timers.set(
      toast.id,
      setTimeout(() => {
        const currentVisibleIds = visibleToastIds();
        const current = toasts.find((item) => item.id === toast.id);

        if (!current || current.status !== 'visible' || !currentVisibleIds.has(current.id)) {
          return;
        }

        dismiss(toast.id);
      }, toast.remaining),
    );

    return { ...toast, createdAt: startedAt };
  };

  const syncTimers = () => {
    syncStatuses();
    const currentVisibleIds = visibleToastIds();
    toasts = toasts.map((toast) => {
      if (toast.status !== 'visible' || toast.duration === null || toast.remaining === null) {
        clearTimer(toast.id);
        return toast;
      }

      if (!currentVisibleIds.has(toast.id)) {
        return pauseTimer(toast);
      }

      return scheduleTimer(toast);
    });
  };

  const remove = (id: string) => {
    const removed = toasts.find((toast) => toast.id === id);

    if (!removed) {
      return;
    }

    clearTimer(id);
    clearRemoveTimer(id);
    toasts = toasts.filter((toast) => toast.id !== id);
    options.onRemove?.(removed);
    syncTimers();
    emit();
  };

  const normalizeToast = (toastOptions: ToastOptions, type?: ToastType): ToastData => {
    const duration = toastOptions.duration === undefined ? defaultDuration : toastOptions.duration;
    const toastType = type ?? toastOptions.type ?? 'default';

    return {
      id: toastOptions.id ?? idFactory(),
      title: toastOptions.title,
      description: toastOptions.description,
      type: toastType,
      duration,
      createdAt: now(),
      remaining: duration,
      status: 'visible',
      announcement: toastOptions.announcement ?? getDefaultAnnouncement(toastType),
      action: toastOptions.action,
      dismissible: toastOptions.dismissible ?? true,
      data: toastOptions.data,
    };
  };

  const createWithType = (toastOptions: ToastOptions, type?: ToastType) => {
    const toast = normalizeToast(toastOptions, type);
    const existing = toasts.some((item) => item.id === toast.id);

    clearTimer(toast.id);
    clearRemoveTimer(toast.id);
    toasts = [toast, ...toasts.filter((item) => item.id !== toast.id)];
    syncTimers();
    const current = toasts.find((item) => item.id === toast.id) ?? toast;
    if (existing) {
      options.onUpdate?.(current);
    } else {
      options.onCreate?.(current);
    }
    emit();

    return toast.id;
  };

  const update = (id: string, updateOptions: ToastUpdateOptions) => {
    const current = toasts.find((toast) => toast.id === id);

    if (!current) {
      return;
    }

    const duration =
      updateOptions.duration === undefined ? current.duration : updateOptions.duration;

    const nextType = updateOptions.type ?? current.type;
    const next: ToastData = {
      ...current,
      title: updateOptions.title === undefined ? current.title : updateOptions.title,
      description:
        updateOptions.description === undefined ? current.description : updateOptions.description,
      type: nextType,
      duration,
      remaining: duration,
      status: 'visible',
      announcement:
        updateOptions.announcement ??
        (updateOptions.type === undefined
          ? current.announcement
          : getDefaultAnnouncement(nextType)),
      action: updateOptions.action === undefined ? current.action : updateOptions.action,
      dismissible: updateOptions.dismissible ?? current.dismissible,
      data: updateOptions.data === undefined ? current.data : updateOptions.data,
      createdAt: now(),
    };

    toasts = toasts.map((toast) => (toast.id === id ? next : toast));
    syncTimers();
    options.onUpdate?.(toasts.find((toast) => toast.id === id) ?? next);
    emit();
  };

  const dismiss = (id?: string) => {
    const ids = id ? [id] : toasts.map((toast) => toast.id);

    ids.forEach((toastId) => {
      const toast = toasts.find((item) => item.id === toastId);

      if (!toast || toast.status === 'dismissing') {
        return;
      }

      clearTimer(toastId);
      const dismissed = { ...toast, status: 'dismissing' as const };
      toasts = toasts.map((item) => (item.id === toastId ? dismissed : item));
      options.onDismiss?.(dismissed);

      if (removeDelay <= 0) {
        remove(toastId);
      } else {
        clearRemoveTimer(toastId);
        const timer = setTimeout(() => {
          removeTimers.delete(toastId);
          remove(toastId);
        }, removeDelay);
        removeTimers.set(toastId, timer);
      }
    });

    syncTimers();
    emit();
  };

  const pause = (id?: string) => {
    const ids = id ? [id] : toasts.map((toast) => toast.id);

    ids.forEach((toastId) => {
      const toast = toasts.find((item) => item.id === toastId);

      if (
        !toast ||
        toast.duration === null ||
        toast.remaining === null ||
        toast.status !== 'visible'
      ) {
        return;
      }

      const paused = pauseTimer(toast);
      toasts = toasts.map((item) => (item.id === toastId ? paused : item));
      options.onPause?.(paused);
    });

    emit();
  };

  const resume = (id?: string) => {
    const ids = id ? [id] : toasts.map((toast) => toast.id);

    ids.forEach((toastId) => {
      const toast = toasts.find((item) => item.id === toastId);

      if (
        !toast ||
        toast.duration === null ||
        toast.remaining === null ||
        toast.status !== 'visible'
      ) {
        return;
      }

      const resumed = { ...toast };
      toasts = toasts.map((item) => (item.id === toastId ? resumed : item));
      options.onResume?.(resumed);
    });

    syncTimers();
    emit();
  };

  const clear = () => {
    const removed = toasts;
    timers.forEach((timer) => clearTimeout(timer));
    removeTimers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    removeTimers.clear();
    toasts = [];
    removed.forEach((toast) => options.onRemove?.(toast));
    emit();
  };

  const destroy = () => {
    timers.forEach((timer) => clearTimeout(timer));
    removeTimers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    removeTimers.clear();
    listeners.clear();
    pageIdleCleanup?.();
    pageIdleCleanup = undefined;
    toasts = [];
  };

  const promise = async <T>(promiseValue: Promise<T>, promiseOptions: ToastPromiseOptions<T>) => {
    const id = createWithType(
      { duration: null, ...promiseOptions.loading },
      promiseOptions.loading.type ?? 'loading',
    );

    try {
      const value = await promiseValue;
      const successOptions =
        typeof promiseOptions.success === 'function'
          ? promiseOptions.success(value)
          : promiseOptions.success;

      update(id, {
        duration: defaultDuration,
        ...successOptions,
        type: successOptions.type ?? 'success',
      });
      return value;
    } catch (error) {
      const errorOptions =
        typeof promiseOptions.error === 'function'
          ? promiseOptions.error(error)
          : promiseOptions.error;

      update(id, {
        duration: defaultDuration,
        ...errorOptions,
        type: errorOptions.type ?? 'error',
      });
      throw error;
    }
  };

  if (options.pauseOnPageIdle && typeof document !== 'undefined') {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pause();
      } else {
        resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    pageIdleCleanup = () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  return {
    placement,
    maxVisibleToasts,
    create: (toastOptions) => createWithType(toastOptions),
    success: (toastOptions) => createWithType(toastOptions, 'success'),
    error: (toastOptions) => createWithType(toastOptions, 'error'),
    warning: (toastOptions) => createWithType(toastOptions, 'warning'),
    info: (toastOptions) => createWithType(toastOptions, 'info'),
    loading: (toastOptions) => createWithType({ duration: null, ...toastOptions }, 'loading'),
    update,
    dismiss,
    pause,
    resume,
    clear,
    destroy,
    promise,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => toasts,
  };
};
