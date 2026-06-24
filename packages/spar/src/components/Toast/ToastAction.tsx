import { ElementType, MouseEvent } from 'react';
import { useToastContext } from './hooks';
import type { ToastActionProps } from './types';

export const ToastAction = <T extends ElementType = 'button'>({
  as,
  children,
  onClick,
  ref,
  type,
  ...props
}: ToastActionProps<T>) => {
  const Component = (as ?? 'button') as ElementType;
  const { toast, toaster } = useToastContext('Toast.Action');
  const isNativeButton = Component === 'button';

  if (!toast.action) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    toast.action?.onClick?.(toast);
    toaster?.dismiss(toast.id);
    onClick?.(event);
  };

  return (
    <Component
      {...props}
      ref={ref}
      type={isNativeButton ? (type ?? 'button') : undefined}
      aria-label={toast.action.altText}
      data-toast-action=''
      onClick={handleClick}
    >
      {children ?? toast.action.label}
    </Component>
  );
};

ToastAction.displayName = 'Toast.Action';
