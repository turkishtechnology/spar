import { useId, useMemo, type ElementType } from 'react';
import { InputContext } from './hooks';
import { useOptionalFieldContext } from '../Field/hooks';
import type { InputContextValue, InputProps } from './types';

/**
 * Input root component that provides visual-input state context for compound
 * children (InputField, InputContainer, Prefix, Suffix, etc.).
 *
 * When nested inside a `<Field>`, it reads the Field's `invalid`, `disabled`,
 * `required` and `readOnly` values automatically. Direct props on `<Input>`
 * override the inherited values.
 */
export const Input = <T extends ElementType = 'div'>({
  as,
  id: providedId,
  invalid,
  disabled,
  required,
  readOnly,
  children,
  ref,
  ...props
}: InputProps<T>) => {
  const Component = as || 'div';
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const fieldCtx = useOptionalFieldContext();

  // Direct props win; otherwise fall back to Field context; then default false.
  const resolvedInvalid = invalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  const contextValue = useMemo<InputContextValue>(
    () => ({
      fieldId: fieldCtx?.fieldId ?? `${id}-field`,
      labelId: fieldCtx?.labelId ?? `${id}-label`,
      descriptionId: fieldCtx?.descriptionId ?? `${id}-description`,
      errorId: fieldCtx?.errorId ?? `${id}-error`,
      invalid: resolvedInvalid,
      disabled: resolvedDisabled,
      required: resolvedRequired,
      readOnly: resolvedReadOnly,
    }),
    [id, fieldCtx, resolvedInvalid, resolvedDisabled, resolvedRequired, resolvedReadOnly],
  );

  const dataAttributes = {
    'data-invalid': resolvedInvalid ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
  };

  const rootProps = {
    ref,
    ...props,
    ...dataAttributes,
  };

  return (
    <InputContext.Provider value={contextValue}>
      <Component {...rootProps}>{children}</Component>
    </InputContext.Provider>
  );
};

Input.displayName = 'Input';
