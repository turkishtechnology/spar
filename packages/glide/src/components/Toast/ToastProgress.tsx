import type { ToastProgressProps } from './Toast.types';

/**
 * Toast Progress component for loading states.
 */
export const ToastProgress = ({
  ref,
  as: Component = 'div',
  value,
  max = 100,
  children,
  'aria-label': ariaLabel,
  ...props
}: ToastProgressProps) => {
  return (
    <Component
      ref={ref}
      role='progressbar'
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      data-toast-progress
      data-progress={value}
      {...props}
    >
      {children}
    </Component>
  );
};

ToastProgress.displayName = 'Toast.Progress';
