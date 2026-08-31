import { useState, useRef, type ChangeEvent, type ElementType } from 'react';
import type { InputFieldProps } from './types';
import { useOptionalInputContext } from './hooks';
import { useMergedRef, useAutoFocus, useMask } from '@/hooks';

/**
 * Coerces a native `value` prop to the string the mask engine works in.
 *
 * The `value` and `defaultValue` props keep their native types — `string`,
 * `number`, or `readonly string[]` — so that a field without a mask stays
 * source-compatible with what it accepted before.
 */
const toMaskInput = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.join('');
  return String(value);
};

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
  onChange,
  mask,
  value,
  defaultValue,
  onValueChange,
  ...props
}: InputFieldProps<T>) => {
  const context = useOptionalInputContext();
  const [focused, setFocused] = useState(false);
  const Component = as || 'input';
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);

  // Auto focus on mount
  useAutoFocus(internalRef, autoFocus);

  const maskState = useMask({
    mask,
    value: toMaskInput(value),
    defaultValue: toMaskInput(defaultValue),
    onValueChange,
    elementRef: internalRef,
  });

  const handleFocus = (event: React.FocusEvent) => {
    setFocused(true);
    onFocus?.(event as React.FocusEvent<HTMLInputElement>);
  };

  const handleBlur = (event: React.FocusEvent) => {
    setFocused(false);
    onBlur?.(event as React.FocusEvent<HTMLInputElement>);
  };

  /**
   * Masks first, then forwards.
   *
   * The mask rewrites `event.target.value` before the consumer's handler runs,
   * so a handler reading `event.target.value` sees the masked value rather than
   * the raw keystrokes.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (maskState.controlled) maskState.onChange(event);
    onChange?.(event);
  };

  const inputType =
    Component === 'input' ? ('type' in props ? (props.type as string) : 'text') : undefined;

  // Either source may set these, and neither may clear the other's answer: a
  // `Field` or `Input` that disables its group wins, and so does a field that
  // disables itself. `??` cannot express that — `Input` resolves its context to
  // a plain boolean, so an unset group reports `false` rather than `undefined`
  // and would silently unset an explicitly passed prop.
  const resolvedDisabled = context?.disabled || props.disabled;
  const resolvedRequired = context?.required || props.required;
  const resolvedReadOnly = context?.readOnly || props.readOnly;

  // With a mask the field is controlled by the hook, so `defaultValue` must not
  // also reach the element. Without one, both fall through untouched. The hook
  // keeps the element after a mask is removed — handing it back would switch
  // React from controlled to uncontrolled mid-life.
  const valueProps = maskState.controlled
    ? { value: maskState.value }
    : {
        ...(value === undefined ? {} : { value }),
        ...(defaultValue === undefined ? {} : { defaultValue }),
      };

  // Attached only when something needs it, so an unmasked field with a `value`
  // and no handler still gets React's read-only-input warning.
  const changeProps = maskState.controlled || onChange ? { onChange: handleChange } : {};

  const dataAttributes = {
    'data-autofocus': autoFocus ? '' : undefined,
    'data-focused': focused ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
    // Presence only — never the pattern itself.
    'data-mask': maskState.active ? '' : undefined,
    'data-mask-completed': maskState.active && maskState.completed ? '' : undefined,
  };

  const ariaAttributes = context
    ? {
        'aria-labelledby': context.labelId,
        'aria-describedby': context.invalid ? context.errorId : context.descriptionId,
        'aria-required': context.required,
        'aria-invalid': context.invalid,
      }
    : {};

  // The resolved values, not the raw context ones — spreading `context.disabled`
  // here is what unset the instance prop, since it lands after `{...props}`.
  const contextProps = context
    ? {
        id: context.fieldId,
        disabled: resolvedDisabled,
        required: resolvedRequired,
        readOnly: resolvedReadOnly,
      }
    : {};

  return (
    <Component
      {...props}
      ref={mergedRef}
      type={inputType}
      {...valueProps}
      {...ariaAttributes}
      {...contextProps}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...changeProps}
      {...dataAttributes}
    />
  );
};

InputField.displayName = 'InputField';
