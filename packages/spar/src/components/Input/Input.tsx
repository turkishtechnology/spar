import { useId, useMemo, type ElementType } from 'react';
import { InputContext } from './hooks';
import type { InputContextValue, InputProps } from './types';

/**
 * Input root component that provides state context for compound input elements.
 * Manages validation, disabled, and required states with proper ARIA coordination.
 */
export const Input = <T extends ElementType = 'div'>({
  as,
  isInvalid = false,
  disabled = false,
  required = false,
  readOnly = false,
  children,
  ref,
  ...props
}: InputProps<T>) => {
  const Component = as || 'div';
  const id = useId();

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

  return (
    <InputContext.Provider value={contextValue}>
      <Component
        ref={ref}
        {...props}
        data-invalid={isInvalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-required={required ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
      >
        {children}
      </Component>
    </InputContext.Provider>
  );
};

Input.displayName = 'Input';
