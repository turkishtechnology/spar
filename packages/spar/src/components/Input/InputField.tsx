import { useState, useContext, useRef, type ElementType } from 'react';
import type { InputFieldProps } from './types';
import { InputContext } from './hooks';
import { useMergedRef, useAutoFocus } from '../../hooks';

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
  const context = useContext(InputContext); // Optional context - can be null
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

  // If no context, render as standalone input (simple usage)
  if (!context) {
    return (
      <Component
        {...props}
        ref={mergedRef}
        type={
          Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-spar-input
        data-autofocus={autoFocus ? '' : undefined}
        data-focused={focused ? '' : undefined}
        data-disabled={props.disabled ? '' : undefined}
        data-required={props.required ? '' : undefined}
        data-readonly={props.readOnly ? '' : undefined}
      />
    );
  }

  // With context, render as compound component part
  const describedBy = context.isInvalid ? context.errorId : context.descriptionId;

  return (
    <Component
      {...props}
      ref={mergedRef}
      id={context.fieldId}
      type={Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined}
      aria-labelledby={context.labelId}
      aria-describedby={describedBy}
      aria-required={context.required}
      aria-invalid={context.isInvalid}
      disabled={context.disabled}
      required={context.required}
      readOnly={context.readOnly}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-spar-input-field
      data-autofocus={autoFocus ? '' : undefined}
      data-focused={focused ? '' : undefined}
      data-disabled={context.disabled ? '' : undefined}
      data-required={context.required ? '' : undefined}
      data-readonly={context.readOnly ? '' : undefined}
    />
  );
};

InputField.displayName = 'InputField';
