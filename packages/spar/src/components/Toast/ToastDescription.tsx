import { ElementType } from 'react';
import { useToastContext } from './hooks';
import type { ToastDescriptionProps } from './types';

export const ToastDescription = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: ToastDescriptionProps<T>) => {
  const Component = (as ?? 'div') as ElementType;
  const { toast } = useToastContext('Toast.Description');

  return (
    <Component {...props} ref={ref} data-toast-description=''>
      {children ?? toast.description}
    </Component>
  );
};

ToastDescription.displayName = 'Toast.Description';
