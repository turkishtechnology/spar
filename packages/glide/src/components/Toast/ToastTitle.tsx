import type { ElementType } from 'react';
import type { ToastTitleProps } from './Toast.types';

/**
 * Toast Title with semantic heading.
 */
export const ToastTitle = ({
  ref,
  as: Component,
  level = 3,
  children,
  ...props
}: ToastTitleProps) => {
  const HeadingComponent = Component ?? (`h${level}` as ElementType);

  return (
    <HeadingComponent ref={ref} data-toast-title {...props}>
      {children}
    </HeadingComponent>
  );
};

ToastTitle.displayName = 'Toast.Title';
