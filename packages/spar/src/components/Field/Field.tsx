import { useId, useMemo, type ElementType } from 'react';
import { FieldContext } from './hooks';
import type { FieldContextValue, FieldProps, FieldRenderProps } from './types';

/**
 * Generic form-field root that provides shared ARIA context for any form
 * control.  Manages coordinated IDs, validation, disabled, required and
 * read-only states so compound children (FieldLabel, FieldDescription,
 * FieldErrorMessage) and the wrapped control are wired automatically.
 *
 * Does NOT own validation logic — `invalid` is a controlled prop intended to
 * be driven by external validation (Zod, etc.).
 */
export const Field = <T extends ElementType = 'div'>({
  as,
  id: providedId,
  invalid = false,
  disabled = false,
  required = false,
  readOnly = false,
  children,
  ref,
  ...props
}: FieldProps<T>) => {
  const Component = as || 'div';
  const generatedId = useId();
  const id = providedId ?? generatedId;

  const contextValue = useMemo<FieldContextValue>(
    () => ({
      fieldId: `${id}-field`,
      labelId: `${id}-label`,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      invalid,
      disabled,
      required,
      readOnly,
    }),
    [id, invalid, disabled, required, readOnly],
  );

  const dataAttributes = {
    'data-invalid': invalid ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-required': required ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
  };

  const renderProps: FieldRenderProps = {
    invalid,
    disabled,
    required,
    readOnly,
  };

  return (
    <FieldContext.Provider value={contextValue}>
      <Component ref={ref} id={id} {...props} {...dataAttributes}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
    </FieldContext.Provider>
  );
};

Field.displayName = 'Field';
