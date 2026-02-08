import { useId } from 'react';
import { InputContext } from './hooks';
import type { InputContextValue, InputProps } from './types';

/**
 * Input root component that provides state context for compound input elements.
 * Manages validation, disabled, and required states with proper ARIA coordination.
 */
export const Input = ({
  isInvalid = false,
  disabled = false,
  required = false,
  children,
  ...props
}: InputProps) => {
  const id = useId();

  const contextValue: InputContextValue = {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    isInvalid,
    disabled,
    required,
  };

  return (
    <InputContext.Provider value={contextValue}>
      <div
        {...props}
        data-spar-input
        data-invalid={isInvalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-required={required ? '' : undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
};

Input.displayName = 'Input';
