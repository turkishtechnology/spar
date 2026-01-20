import { Dialog as DialogRoot } from './Dialog';
import { DialogTrigger } from './DialogTrigger';
import { DialogPortal } from './DialogPortal';
import { DialogOverlay } from './DialogOverlay';
import { DialogContent } from './DialogContent';
import { DialogTitle } from './DialogTitle';
import { DialogDescription } from './DialogDescription';
import { DialogClose } from './DialogClose';

// Create compound component with dot notation support
const Dialog = DialogRoot as typeof DialogRoot & {
  Root: typeof DialogRoot;
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Close: typeof DialogClose;
};

Dialog.Root = DialogRoot;
Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;

// Export both patterns
export {
  // Compound component (with dot notation)
  Dialog,

  // Named exports (tree-shakeable)
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,

  // Root alias for explicit usage
  DialogRoot,
};

// Export types
export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogTriggerRenderProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogCloseRenderProps,
  DialogContextValue,
} from './types';
