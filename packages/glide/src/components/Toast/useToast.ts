import { useToastContext } from './ToastProvider';
import { useToastFunction } from './ToastComponents';
import type { UseToastReturn } from './Toast.types';

/**
 * Toast işlemleri için ana hook
 * Hem programmatik hem deklaratif toast yönetimi sağlar
 */
export function useToast(): UseToastReturn {
  const context = useToastContext();
  const toastFunctions = useToastFunction();

  return {
    // Context'ten gelen fonksiyonlar
    addToast: context.addToast,
    removeToast: context.removeToast,
    updateToast: context.updateToast,
    clearAll: context.clearAll,
    toasts: context.toasts,
    allToasts: context.allToasts,
    queuedToasts: context.queuedToasts,

    // Utility fonksiyonlar
    ...toastFunctions,
  };
}