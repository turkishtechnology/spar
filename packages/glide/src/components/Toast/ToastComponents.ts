import { ReactNode } from 'react';
import { useToastContext } from './ToastProvider';
import type { ToastConfig } from './Toast.types';

/**
 * Programmatik toast oluşturma fonksiyonu
 * @param content - Toast içeriği (string veya ReactNode)
 * @param config - Toast konfigürasyonu
 * @returns Toast ID
 */
export function toast(content: ReactNode, config?: ToastConfig): string {
  // Bu fonksiyon hook dışında kullanılabilir olmalı
  // Global context'e erişim için singleton pattern kullanacağız
  if (typeof window === 'undefined') {
    throw new Error('toast() can only be used in browser environment');
  }

  const event = new CustomEvent('glide-toast', {
    detail: { content, config },
  });

  window.dispatchEvent(event);

  // ID'yi event detail'inde döneceğiz
  return (event as CustomEvent & { detail: { id?: string } }).detail.id || '';
}

/**
 * Variant-specific toast fonksiyonları with duration override support
 */
toast.success = (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) =>
  toast(content, { ...config, variant: 'success' });

toast.error = (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) =>
  toast(content, { ...config, variant: 'error' });

toast.warning = (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) =>
  toast(content, { ...config, variant: 'warning' });

toast.info = (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) =>
  toast(content, { ...config, variant: 'info' });

toast.loading = (content: ReactNode, config?: Omit<ToastConfig, 'variant'>) =>
  toast(content, { ...config, variant: 'loading' });

/**
 * Duration-specific convenience methods
 */
toast.quick = (content: ReactNode, config?: ToastConfig) =>
  toast(content, { ...config, duration: 2000 }); // 2 seconds

toast.long = (content: ReactNode, config?: ToastConfig) =>
  toast(content, { ...config, duration: 8000 }); // 8 seconds

toast.persistent = (content: ReactNode, config?: ToastConfig) =>
  toast(content, { ...config, isPersistent: true, duration: 0 }); // No auto-dismiss

/**
 * Promise-based toast
 */
toast.promise = async <T>(
  promise: Promise<T>,
  options: {
    loading?: ReactNode;
    success?: ReactNode | ((data: T) => ReactNode);
    error?: ReactNode | ((error: unknown) => ReactNode);
    config?: ToastConfig;
  },
): Promise<T> => {
  const loadingToastId = toast.loading(options.loading || 'Loading...', {
    ...options.config,
    isPersistent: true,
  });

  try {
    const data = await promise;

    // Loading toast'ını kapat
    const event = new CustomEvent('glide-toast-remove', {
      detail: { id: loadingToastId },
    });
    window.dispatchEvent(event);

    // Success toast göster
    const successContent =
      typeof options.success === 'function' ? options.success(data) : options.success || 'Success!';

    toast.success(successContent, options.config);

    return data;
  } catch (error) {
    // Loading toast'ını kapat
    const removeEvent = new CustomEvent('glide-toast-remove', {
      detail: { id: loadingToastId },
    });
    window.dispatchEvent(removeEvent);

    // Error toast göster
    const errorContent =
      typeof options.error === 'function'
        ? options.error(error)
        : options.error || 'Something went wrong';

    toast.error(errorContent, options.config);

    throw error;
  }
};

/**
 * Hook için context-aware toast fonksiyonu
 * Event listener setup ToastProvider'da yapılıyor
 */
export function useToastFunction() {
  const { addToast, removeToast, updateToast, clearAll, config } = useToastContext();

  return {
    toast: (content: ReactNode, toastConfig?: ToastConfig) => {
      // Duration resolution: provided > provider default
      const resolvedConfig = {
        ...toastConfig,
        duration: toastConfig?.duration ?? config.duration,
      };
      return addToast({ content, ...resolvedConfig });
    },
    success: (content: ReactNode, toastConfig?: Omit<ToastConfig, 'variant'>) =>
      addToast({
        content,
        ...toastConfig,
        variant: 'success',
        duration: toastConfig?.duration ?? config.duration,
      }),
    error: (content: ReactNode, toastConfig?: Omit<ToastConfig, 'variant'>) =>
      addToast({
        content,
        ...toastConfig,
        variant: 'error',
        duration: toastConfig?.duration ?? config.duration,
      }),
    warning: (content: ReactNode, toastConfig?: Omit<ToastConfig, 'variant'>) =>
      addToast({
        content,
        ...toastConfig,
        variant: 'warning',
        duration: toastConfig?.duration ?? config.duration,
      }),
    info: (content: ReactNode, toastConfig?: Omit<ToastConfig, 'variant'>) =>
      addToast({
        content,
        ...toastConfig,
        variant: 'info',
        duration: toastConfig?.duration ?? config.duration,
      }),
    loading: (content: ReactNode, toastConfig?: Omit<ToastConfig, 'variant'>) =>
      addToast({
        content,
        ...toastConfig,
        variant: 'loading',
        duration: toastConfig?.duration ?? config.duration,
      }),
    // Duration shortcuts
    quick: (content: ReactNode, toastConfig?: ToastConfig) =>
      addToast({ content, ...toastConfig, duration: 2000 }),
    long: (content: ReactNode, toastConfig?: ToastConfig) =>
      addToast({ content, ...toastConfig, duration: 10000 }),
    persistent: (content: ReactNode, toastConfig?: ToastConfig) =>
      addToast({ content, ...toastConfig, isPersistent: true, duration: 0 }),
    remove: removeToast,
    update: updateToast,
    clear: clearAll,
  };
}
