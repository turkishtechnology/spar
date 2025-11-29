import { createContext, useContext, useId } from 'react';
import type { InputContextValue, InputRootProps } from './types';

const InputContext = createContext<InputContextValue | null>(null);

const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Input compound components must be used within Input.Root');
  }
  return context;
};

export { InputContext, useInputContext };

/**
 * Input root component that provides state context for compound input elements.
 * Manages validation, disabled, and required states with proper ARIA coordination.
 */
export const InputRoot = ({
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  children,
  ...props
}: InputRootProps) => {
  const id = useId();

  const contextValue: InputContextValue = {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    isInvalid,
    isDisabled,
    isRequired,
  };

  return (
    <InputContext.Provider value={contextValue}>
      <div
        {...props}
        data-spar-input
        data-invalid={isInvalid ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-required={isRequired ? '' : undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
};

InputRoot.displayName = 'Input.Root';
