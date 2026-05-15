import { type ElementType } from 'react';
import { useFieldContext } from './hooks';
import type { FieldErrorMessageProps } from './types';

/**
 * Error message for a field. Only renders when the field's `invalid` prop is
 * `true`.  Announced to screen readers via `role="alert"` (which implies
 * `aria-live="assertive"` and `aria-atomic="true"` per WAI-ARIA 1.2 spec).
 */
export const FieldErrorMessage = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: FieldErrorMessageProps<T>) => {
  const Component = as || 'div';
  const context = useFieldContext();

  if (!context.invalid) {
    return null;
  }

  const dataAttributes = {
    'data-invalid': context.invalid ? '' : undefined,
    'data-disabled': context.disabled ? '' : undefined,
    'data-readonly': context.readOnly ? '' : undefined,
  };

  return (
    <Component {...props} ref={ref} id={context.errorId} role='alert' {...dataAttributes}>
      {children}
    </Component>
  );
};

FieldErrorMessage.displayName = 'FieldErrorMessage';
