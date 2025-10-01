import type { ToastDescriptionProps } from './Toast.types';

/**
 * Toast Description component.
 */
export const ToastDescription = ({
  ref,
  as: Component = 'p',
  children,
  ...props
}: ToastDescriptionProps) => {
  return (
    <Component ref={ref} data-toast-description {...props}>
      {children}
    </Component>
  );
};

ToastDescription.displayName = 'Toast.Description';
