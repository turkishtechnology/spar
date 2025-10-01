import type { ToastVariant, PriorityOrder, ToastPriority } from './Toast.types';

// Optimized ID generation with better performance
let toastIdCounter = 0;

export const generateToastId = (): string => {
  toastIdCounter = (toastIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${toastIdCounter}-${Date.now()}`;
};

// ARIA role calculation utility
export const getAriaRole = (variant: ToastVariant): string => {
  switch (variant) {
    case 'error':
      return 'alert';
    case 'loading':
      return 'log';
    default:
      return 'status';
  }
};

// ARIA live calculation utility
export const getAriaLive = (variant: ToastVariant): 'assertive' | 'polite' => {
  switch (variant) {
    case 'error':
    case 'warning':
      return 'assertive';
    default:
      return 'polite';
  }
};

// Enhanced toast sorting: Priority DESC, CreatedAt ASC
export const sortToastQueue = (
  a: { priority: ToastPriority; createdAt: number },
  b: { priority: ToastPriority; createdAt: number },
  priorityOrder: PriorityOrder,
): number => {
  // Primary sort: Priority DESC (high priority first)
  const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

  // Secondary sort: CreatedAt ASC (older first for same priority)
  if (priorityDiff === 0) {
    return a.createdAt - b.createdAt;
  }

  return priorityDiff;
};

// Legacy function for backward compatibility
export const sortByPriority = (
  a: { priority: ToastPriority },
  b: { priority: ToastPriority },
  priorityOrder: PriorityOrder,
): number => {
  return priorityOrder[a.priority] - priorityOrder[b.priority];
};

// Queue management utilities
export const getVisibleToasts = <T extends { priority: ToastPriority; createdAt: number }>(
  toasts: T[],
  visibleLimit: number,
  priorityOrder: PriorityOrder,
): { visible: T[]; queued: T[] } => {
  const sorted = [...toasts].sort((a, b) => sortToastQueue(a, b, priorityOrder));

  return {
    visible: sorted.slice(0, visibleLimit),
    queued: sorted.slice(visibleLimit),
  };
};
