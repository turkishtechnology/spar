import { createContext, useContext, useId, useState, useEffect } from 'react';
import type {
  InputContextValue,
  InputRootProps,
  InputFieldProps,
  InputLabelProps,
  InputDescriptionProps,
  InputErrorMessageProps,
} from './types';

const InputContext = createContext<InputContextValue | null>(null);

const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Input compound components must be used within Input.Root');
  }
  return context;
};

/**
 * Input root component that provides state context for compound input elements.
 * Manages validation, disabled, and required states with proper ARIA coordination.
 */
const InputRoot = ({
  invalid = false,
  disabled = false,
  required = false,
  children,
  ...props
}: InputRootProps) => {
  const id = useId();
  const [internalInvalid, setInvalid] = useState(invalid);
  const [internalDisabled, setDisabled] = useState(disabled);
  const [internalRequired, setRequired] = useState(required);

  // Sync external props with internal state
  useEffect(() => {
    setInvalid(invalid);
  }, [invalid]);

  useEffect(() => {
    setDisabled(disabled);
  }, [disabled]);

  useEffect(() => {
    setRequired(required);
  }, [required]);

  const contextValue: InputContextValue = {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid: internalInvalid,
    disabled: internalDisabled,
    required: internalRequired,
    setInvalid,
    setDisabled,
    setRequired,
  };

  return (
    <InputContext.Provider value={contextValue}>
      <div
        {...props}
        data-glide-input
        data-invalid={internalInvalid ? '' : undefined}
        data-disabled={internalDisabled ? '' : undefined}
        data-required={internalRequired ? '' : undefined}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
};

/**
 * Input field component that renders the core input element with full accessibility support.
 * Supports polymorphic rendering for input and textarea elements.
 */
const InputField = ({
  as: Component = 'input',
  type = 'text',
  ref,
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) => {
  const context = useInputContext();
  const [focused, setFocused] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const describedBy = context.invalid ? context.errorId : context.descriptionId;

  return (
    <Component
      {...props}
      ref={ref}
      id={context.fieldId}
      type={Component === 'input' ? type : undefined}
      aria-labelledby={context.labelId}
      aria-describedby={describedBy}
      aria-required={context.required}
      aria-invalid={context.invalid}
      disabled={context.disabled}
      required={context.required}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-glide-input-field
      data-focused={focused ? '' : undefined}
    />
  );
};

/**
 * Input label component that provides accessible labeling for the input field.
 * Automatically associates with the input field via ARIA.
 */
const InputLabel = ({ children, ref, ...props }: InputLabelProps) => {
  const context = useInputContext();

  return (
    <label
      {...props}
      ref={ref}
      id={context.labelId}
      htmlFor={context.fieldId}
      data-glide-input-label
    >
      {children}
    </label>
  );
};

/**
 * Input description component that provides helper text for the input field.
 * Automatically linked to the input field via aria-describedby.
 */
const InputDescription = ({ children, ref, ...props }: InputDescriptionProps) => {
  const context = useInputContext();

  return (
    <div {...props} ref={ref} id={context.descriptionId} data-glide-input-description>
      {children}
    </div>
  );
};

/**
 * Input error message component that announces validation errors to screen readers.
 * Uses role="alert" for immediate announcement and is automatically linked to the input field.
 */
const InputErrorMessage = ({ children, ref, ...props }: InputErrorMessageProps) => {
  const context = useInputContext();

  if (!context.invalid) {
    return null;
  }

  return (
    <div {...props} ref={ref} id={context.errorId} role='alert' data-glide-input-error>
      {children}
    </div>
  );
};

InputRoot.displayName = 'Input.Root';
InputField.displayName = 'Input.Field';
InputLabel.displayName = 'Input.Label';
InputDescription.displayName = 'Input.Description';
InputErrorMessage.displayName = 'Input.ErrorMessage';

/**
 * Headless Input component providing accessible form input primitives with zero styling opinions.
 * Supports compound component pattern for flexible composition and full ARIA implementation.
 */
export const Input = {
  Root: InputRoot,
  Field: InputField,
  Label: InputLabel,
  Description: InputDescription,
  ErrorMessage: InputErrorMessage,
};
