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

// Priority-based toast sorting
export const sortByPriority = (
  a: { priority: ToastPriority },
  b: { priority: ToastPriority },
  priorityOrder: PriorityOrder,
): number => {
  return priorityOrder[a.priority] - priorityOrder[b.priority];
};
