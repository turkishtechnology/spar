import { ElementType, MouseEvent } from 'react';
import { useToastContext } from './hooks';
import type { ToastCloseProps } from './types';

export const ToastClose = <T extends ElementType = 'button'>({
  as,
  children,
  onClick,
  ref,
  type,
  ...props
}: ToastCloseProps<T>) => {
  const Component = (as ?? 'button') as ElementType;
  const { toast, toaster } = useToastContext('Toast.Close');
  const isNativeButton = Component === 'button';
  const hasChildren = children != null;

  if (!toast.dismissible) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    toaster?.dismiss(toast.id);
    onClick?.(event);
  };

  return (
    <Component
      {...props}
      ref={ref}
      type={isNativeButton ? (type ?? 'button') : undefined}
      aria-label={props['aria-label'] ?? (hasChildren ? undefined : 'Dismiss notification')}
      data-toast-close=''
      onClick={handleClick}
    >
      {children}
    </Component>
  );
};

ToastClose.displayName = 'Toast.Close';
