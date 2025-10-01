import type { ToastActionProps } from './Toast.types';

/**
 * Toast Action button component.
 */
export const ToastAction = ({
  ref,
  as: Component = 'button',
  altText,
  children,
  ...props
}: ToastActionProps) => {
  const buttonType = Component === 'button' ? 'button' : undefined;

  return (
    <Component ref={ref} type={buttonType} aria-label={altText} data-toast-action {...props}>
      {children}
    </Component>
  );
};

ToastAction.displayName = 'Toast.Action';
