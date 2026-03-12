import { useId, useMemo, type ElementType } from 'react';
import { InputContext } from './hooks';
import type { InputContextValue, InputProps } from './types';

/**
 * Input root component that provides state context for compound input elements.
 * Manages validation, disabled, and required states with proper ARIA coordination.
 */
export const Input = <T extends ElementType = 'div'>({
  as,
  id: providedId,
  isInvalid = false,
  disabled = false,
  required = false,
  readOnly = false,
  children,
  ref,
  ...props
}: InputProps<T>) => {
  const Component = as || 'div';
  const generatedId = useId();
  const id = providedId ?? generatedId;

  const contextValue = useMemo<InputContextValue>(
    () => ({
      fieldId: `${id}-field`,
      labelId: `${id}-label`,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      isInvalid,
      disabled,
      required,
      readOnly,
    }),
    [id, isInvalid, disabled, required, readOnly],
  );

  const dataAttributes = {
    'data-invalid': isInvalid ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-required': required ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
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
