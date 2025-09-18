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

// Create aliases for grouped pattern usage
const Provider = ToastProvider;
const Root = ToastRoot;
const Content = ToastContent;
const Title = ToastTitle;
const Description = ToastDescription;
const Action = ToastAction;
const Close = ToastClose;
const Icon = ToastIcon;
const Progress = ToastProgress;

// Export both named components AND aliases for dual usage pattern
export {
  // Named exports (for direct imports)
  ToastProvider,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
  ToastProgress,

  // Aliased exports (for grouped pattern usage)
  Provider,
  Root,
  Content,
  Title,
  Description,
  Action,
  Close,
  Icon,
  Progress,
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
} from './types';

// Performance utilities (optional for development)
export {
  performanceTracker,
  toastBenchmark,
  ToastPerformanceTracker,
  ToastBenchmark,
} from './performance';

// Utility hooks
export {
  useToastTimer,
  useStableCallback,
  useBatchedState,
  useEventHandler,
  useVisibility,
} from './hooks';

// Usage examples:
// Direct import: import { ToastRoot, ToastContent } from '@glide/components';
// Grouped import: import { Root, Content } from '@glide/components/Toast';
