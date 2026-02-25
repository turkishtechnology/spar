import { Dialog as DialogRoot } from './Dialog';
import { DialogTrigger } from './DialogTrigger';
import { DialogOverlay } from './DialogOverlay';
import { DialogContent } from './DialogContent';
import { DialogTitle } from './DialogTitle';
import { DialogDescription } from './DialogDescription';
import { DialogClose } from './DialogClose';
export { useDialogContext } from './hooks';

const Dialog = DialogRoot as typeof DialogRoot & {
  Root: typeof DialogRoot;
  Trigger: typeof DialogTrigger;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Close: typeof DialogClose;
};

Dialog.Root = DialogRoot;
Dialog.Trigger = DialogTrigger;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;

export {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

export type {
  DialogProps,
  DialogTriggerProps,
  DialogTriggerRenderProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
  DialogCloseRenderProps,
  DialogContextValue,
} from './types';
