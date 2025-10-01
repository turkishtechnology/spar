import {
  ToastProvider,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
  ToastProgress,
} from './Toast';

const Toast = {
  Provider: ToastProvider,
  Root: ToastRoot,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Icon: ToastIcon,
  Progress: ToastProgress,
};

// Export both patterns
export {
  // Compound component (with dot notation)
  Toast,

  // Named exports (tree-shakeable)
  ToastProvider,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
  ToastProgress,
};

// Export types
export type {
  ToastProviderProps,
  ToastRootProps,
  ToastContentProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
  ToastIconProps,
  ToastProgressProps,
  ToastVariant,
  ToastSize,
  ToastPriority,
  ToastPosition,
  SwipeDirection,
  ToastState,
  ToastConfig,
  ToastItem,
  ToastContextValue,
  UseToastReturn,
  UseToastStateReturn,
} from './Toast.types';

// Context hooks
export { useToastContext } from './ToastProvider';

// Utility hooks
export { useToastTimer, useVisibility } from './hooks';

// Usage examples:
// Direct imports: import { ToastProvider, ToastRoot, ToastContent } from '@glide/components/Toast';
