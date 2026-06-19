import { ElementType } from 'react';
import { useToastContext } from './hooks';
import type { ToastTitleProps } from './types';

export const ToastTitle = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: ToastTitleProps<T>) => {
  const Component = (as ?? 'div') as ElementType;
  const { toast } = useToastContext('Toast.Title');

  return (
    <Component {...props} ref={ref} data-toast-title=''>
      {children ?? toast.title}
    </Component>
  );
};

ToastTitle.displayName = 'Toast.Title';
