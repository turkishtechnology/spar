import type { ToastIconProps } from './Toast.types';

/**
 * Toast Icon component for variant indicators.
 */
export const ToastIcon = ({ ref, as: Component = 'span', children, ...props }: ToastIconProps) => {
  return (
    <Component ref={ref} data-toast-icon aria-hidden='true' {...props}>
      {children}
    </Component>
  );
};

ToastIcon.displayName = 'Toast.Icon';
