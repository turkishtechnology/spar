import { useState, useContext, type ElementType } from 'react';
import type { PolymorphicInputFieldProps } from './types';
import { InputContext } from './InputRoot';

/**
 * Input field component that renders the core input element with full accessibility support.
 * Supports polymorphic rendering for input and textarea elements.
 */
export const InputField = <T extends ElementType = 'input'>({
  as,
  ref,
  onFocus,
  onBlur,
  ...props
}: PolymorphicInputFieldProps<T>) => {
  const context = useContext(InputContext); // Optional context - can be null
  const [focused, setFocused] = useState(false);
  const Component = (as || 'input') as ElementType;

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  // If no context, render as standalone input (simple usage)
  if (!context) {
    return (
      <Component
        {...props}
        ref={ref}
        type={
          Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-spar-input
        data-focused={focused ? '' : undefined}
      />
    );
  }

  // With context, render as compound component part
  const describedBy = context.isInvalid ? context.errorId : context.descriptionId;

  return (
    <Component
      {...props}
      ref={ref}
      id={context.fieldId}
      type={Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined}
      aria-labelledby={context.labelId}
      aria-describedby={describedBy}
      aria-required={context.isRequired}
      aria-invalid={context.isInvalid}
      disabled={context.isDisabled}
      required={context.isRequired}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-spar-input-field
      data-focused={focused ? '' : undefined}
    />
  );
};

InputField.displayName = 'Input.Field';
