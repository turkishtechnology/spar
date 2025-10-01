// Core components
import { ToastProvider } from './ToastProvider';
import { ToastRoot } from './ToastRoot';
import { ToastContent } from './ToastContent';
import { ToastTitle } from './ToastTitle';
import { ToastDescription } from './ToastDescription';
import { ToastAction } from './ToastAction';
import { ToastClose } from './ToastClose';
import { ToastIcon } from './ToastIcon';
import { ToastProgress } from './ToastProgress';

// New components
import { ToastViewport } from './ToastViewport';
import { DeclarativeToast } from './DeclarativeToast';

export { ToastViewport, DeclarativeToast };

const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Icon: ToastIcon,
  Progress: ToastProgress,
  // Deklaratif kullanım için
  Declarative: DeclarativeToast,
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
  SwipeDirection,
  ToastState,
  ToastConfig,
  ToastItem,
  ToastContextValue,
  UseToastReturn,
  UseToastStateReturn,
} from './Toast.types';

// Export ToastViewport types
export type { ToastPosition } from './ToastViewport';

// Context hooks
export { useToastContext } from './ToastProvider';

// Utility hooks
export { useToastTimer, useVisibility } from './hooks';
export { useToast } from './useToast';
export { useSwipeGesture } from './useSwipeGesture';

// Toast functions
export { toast } from './ToastComponents';

// Usage examples:
// Direct imports: import { ToastProvider, ToastRoot, ToastContent } from '@glide/components/Toast';
