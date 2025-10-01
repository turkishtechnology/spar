import { useCallback, type MouseEvent } from 'react';
import type { ToastCloseProps } from './Toast.types';

/**
 * Toast Close button component.
 */
export const ToastClose = ({
  ref,
  as: Component = 'button',
  children,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: ToastCloseProps) => {
  const buttonType = Component === 'button' ? 'button' : undefined;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      onClick?.(event);
      // In real implementation, would close the toast
    },
    [onClick],
  );

  return (
    <Component
      ref={ref}
      type={buttonType}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      data-toast-close
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
};

ToastClose.displayName = 'Toast.Close';
