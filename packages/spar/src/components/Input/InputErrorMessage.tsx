import type { InputErrorMessageProps } from './types';
import { useInputContext } from './InputRoot';

/**
 * Input error message component that announces validation errors to screen readers.
 * Uses role="alert" for immediate announcement and is automatically linked to the input field.
 */
export const InputErrorMessage = ({ children, ref, ...props }: InputErrorMessageProps) => {
  const context = useInputContext();

  if (!context.isInvalid) {
    return null;
  }

  return (
    <div
      {...props}
      ref={ref}
      id={context.errorId}
      role='alert'
      aria-live='assertive'
      data-spar-input-error
    >
      {children}
    </div>
  );
};

InputErrorMessage.displayName = 'Input.ErrorMessage';
