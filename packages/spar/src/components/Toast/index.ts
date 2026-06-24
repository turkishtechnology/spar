import { Toaster } from './Toaster';
import { Toast as ToastRoot } from './Toast';
import { ToastTitle } from './ToastTitle';
import { ToastDescription } from './ToastDescription';
import { ToastAction } from './ToastAction';
import { ToastClose } from './ToastClose';

export { createToaster } from './createToaster';
export { useToastContext } from './hooks';

// Unlike Dialog/Tabs, the `Toast` namespace is a plain object rather than a
// callable root with parts attached: `Toast.Root` takes per-item `toast`/`toaster`
// props supplied by the `Toaster` render prop, so `<Toast>` on its own is not a
// meaningful component.
const Toast = {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
};

export { Toaster, Toast, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose };

export type {
  CreateToasterOptions,
  ToastAnnouncement,
  ToastActionOptions,
  ToastActionProps,
  ToastCloseProps,
  ToastData,
  ToastDescriptionProps,
  ToastOptions,
  ToastPlacement,
  ToastPromiseOptions,
  ToastRootProps,
  ToastStatus,
  ToastTitleProps,
  ToasterController,
  ToasterProps,
  ToastType,
  ToastUpdateOptions,
} from './types';
