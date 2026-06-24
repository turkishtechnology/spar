import type { ElementType, ReactNode } from 'react';
import type { PolymorphicProps } from '../../types';

export type ToastPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

export type ToastStatus = 'queued' | 'visible' | 'dismissing';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastAnnouncement = 'polite' | 'assertive';

export interface ToastData {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  type: ToastType;
  duration: number | null;
  createdAt: number;
  remaining: number | null;
  status: ToastStatus;
  announcement: ToastAnnouncement;
  action?: ToastActionOptions | undefined;
  dismissible: boolean;
  data?: unknown;
}

export interface ToastActionOptions {
  label: ReactNode;
  altText: string;
  onClick?: (toast: ToastData) => void;
}

export interface ToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  type?: ToastType;
  duration?: number | null;
  announcement?: ToastAnnouncement;
  action?: ToastActionOptions | undefined;
  dismissible?: boolean;
  data?: unknown;
}

export type ToastUpdateOptions = Partial<Omit<ToastOptions, 'id'>>;

export interface ToastPromiseOptions<TData> {
  loading: ToastOptions;
  success: ToastOptions | ((value: TData) => ToastOptions);
  error: ToastOptions | ((error: unknown) => ToastOptions);
}

export interface CreateToasterOptions {
  placement?: ToastPlacement;
  duration?: number;
  maxVisibleToasts?: number;
  pauseOnPageIdle?: boolean;
  removeDelay?: number;
  idFactory?: () => string;
  onCreate?: (toast: ToastData) => void;
  onUpdate?: (toast: ToastData) => void;
  onDismiss?: (toast: ToastData) => void;
  onRemove?: (toast: ToastData) => void;
  onPause?: (toast: ToastData) => void;
  onResume?: (toast: ToastData) => void;
}

export interface ToasterController {
  placement: ToastPlacement;
  maxVisibleToasts: number;
  create: (options: ToastOptions) => string;
  success: (options: ToastOptions) => string;
  error: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  info: (options: ToastOptions) => string;
  loading: (options: ToastOptions) => string;
  update: (id: string, options: ToastUpdateOptions) => void;
  dismiss: (id?: string) => void;
  pause: (id?: string) => void;
  resume: (id?: string) => void;
  clear: () => void;
  destroy: () => void;
  promise: <TData>(promise: Promise<TData>, options: ToastPromiseOptions<TData>) => Promise<TData>;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => ToastData[];
}

export type ToasterProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  {
    toaster: ToasterController;
    children: (toast: ToastData) => ReactNode;
    label?: string;
    hotkey?: string[];
    overlap?: boolean;
  }
>;

export type ToastRootProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  {
    toast: ToastData;
    toaster?: ToasterController;
  }
>;

export type ToastTitleProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  {
    children?: ReactNode;
  }
>;

export type ToastDescriptionProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  {
    children?: ReactNode;
  }
>;

export type ToastActionProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  {
    children?: ReactNode;
  }
>;

export type ToastCloseProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  {
    children?: ReactNode;
  }
>;

/** @internal */
export interface ToastContextValue {
  toast: ToastData;
  toaster?: ToasterController | undefined;
}
