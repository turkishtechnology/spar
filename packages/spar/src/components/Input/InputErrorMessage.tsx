import { type ElementType } from 'react';
import type { InputErrorMessageProps } from './types';
import { useInputContext } from './hooks';

/**
 * Input error message component that announces validation errors to screen readers.
 * Uses role="alert" for immediate announcement and is automatically linked to the input field.
 */
export const InputErrorMessage = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: InputErrorMessageProps<T>) => {
  const Component = as || 'div';
  const context = useInputContext();

  if (!context.isInvalid) {
    return null;
  }

  return (
    <Component
      {...props}
      ref={ref}
      id={context.errorId}
      role='alert'
      aria-live='assertive'
      data-spar-input-error
    >
      {children}
    </Component>
  );
};

InputErrorMessage.displayName = 'InputErrorMessage';
