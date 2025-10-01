import type { ToastContentProps } from './Toast.types';

/**
 * Toast Content wrapper.
 */
export const ToastContent = ({
  ref,
  as: Component = 'div',
  children,
  ...props
}: ToastContentProps) => {
  return (
    <Component ref={ref} data-toast-content {...props}>
      {children}
    </Component>
  );
};

ToastContent.displayName = 'Toast.Content';
