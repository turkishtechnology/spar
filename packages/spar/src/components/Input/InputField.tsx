import { useState, useRef, type ElementType } from 'react';
import type { InputFieldProps } from './types';
import { useOptionalInputContext } from './hooks';
import { useMergedRef, useAutoFocus } from '@/hooks';

/**
 * Input field component that renders the core input element with full accessibility support.
 * Supports polymorphic rendering for input and textarea elements.
 */
export const InputField = <T extends ElementType = 'input'>({
  as,
  ref,
  autoFocus = false,
  onFocus,
  onBlur,
  ...props
}: InputFieldProps<T>) => {
  const context = useOptionalInputContext();
  const [focused, setFocused] = useState(false);
  const Component = as || 'input';
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);

  // Auto focus on mount
  useAutoFocus(internalRef, autoFocus);

  const handleFocus = (event: React.FocusEvent) => {
    setFocused(true);
    onFocus?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const handleBlur = (event: React.FocusEvent) => {
    setFocused(false);
    onBlur?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const inputType =
    Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined;

  const resolvedDisabled = context?.disabled ?? props.disabled;
  const resolvedRequired = context?.required ?? props.required;
  const resolvedReadOnly = context?.readOnly ?? props.readOnly;

  const dataAttributes = {
    'data-autofocus': autoFocus ? '' : undefined,
    'data-focused': focused ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
  };

  const ariaAttributes = context
    ? {
        'aria-labelledby': context.labelId,
        'aria-describedby': context.isInvalid ? context.errorId : context.descriptionId,
        'aria-required': context.required,
        'aria-invalid': context.isInvalid,
      }
    : {};

  const contextProps = context
    ? {
        id: context.fieldId,
        disabled: context.disabled,
        required: context.required,
        readOnly: context.readOnly,
      }
    : {};

  return (
    <Component
      {...props}
      ref={mergedRef}
      type={inputType}
      {...ariaAttributes}
      {...contextProps}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...dataAttributes}
    />
  );
};

InputField.displayName = 'InputField';
