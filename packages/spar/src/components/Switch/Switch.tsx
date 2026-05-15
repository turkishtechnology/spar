import { type ElementType, useId, useRef } from 'react';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';
import { useOptionalFieldContext } from '../Field/hooks';
import { useSwitch } from './hooks';
import type { SwitchProps, SwitchRenderProps } from './types';

/**
 * Headless switch component for boolean toggle controls. Provides accessible switch semantics with form integration.
 *
 * When nested inside a `<Field>`, it reads the Field's `invalid`, `disabled`,
 * `required` and `readOnly` values automatically. Direct props on `<Switch>`
 * override the inherited values.
 */
export const Switch = <T extends ElementType = 'button'>({
  as,
  checked,
  defaultChecked,
  onChange,
  isInvalid,
  disabled,
  name,
  value = 'on',
  form,
  required,
  readOnly,
  autoFocus = false,
  id: providedId,
  children,
  ref,
  ...restProps
}: SwitchProps<T>) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  // Field context integration — direct props win over inherited Field values.
  const fieldCtx = useOptionalFieldContext();
  const resolvedInvalid = isInvalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  // Refs
  const internalRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(internalRef, ref as React.Ref<HTMLButtonElement>);

  // Use the switch hook
  const {
    checked: checkedState,
    isFocused,
    isHovered,
    isActive,
    setChecked,
    switchProps,
    hiddenInputProps,
  } = useSwitch({
    ...(checked !== undefined && { checked }),
    ...(defaultChecked !== undefined && { defaultChecked }),
    ...(onChange && { onChange }),
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
  });

  // Render props for children function
  const renderProps: SwitchRenderProps = {
    checked: checkedState,
    setChecked,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    required: resolvedRequired,
    isInvalid: resolvedInvalid,
    isFocused,
    isHovered,
    isPressed: isActive,
  };

  // Extract known props to prevent conflicts
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    style,
    ...safeProps
  } = restProps;

  // Extract event handlers from switchProps
  // Note: We don't pass onKeyDown because Button already handles Space/Enter
  // and calls onClick, which triggers handleToggle
  const {
    onClick,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  } = switchProps;

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    id: fieldCtx?.fieldId ?? id,
    disabled: resolvedDisabled,
    autoFocus,
    role: 'switch' as const,
    'aria-checked': checkedState,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy ?? fieldCtx?.labelId,
    'aria-describedby':
      ariaDescribedBy ??
      (fieldCtx ? (resolvedInvalid ? fieldCtx.errorId : fieldCtx.descriptionId) : undefined),
    'aria-required': resolvedRequired || undefined,
    'aria-readonly': resolvedReadOnly || undefined,
    'aria-invalid': resolvedInvalid || undefined,
    'data-switch': '',
    'data-state': checkedState ? 'checked' : 'unchecked',
    'data-checked': checkedState ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-invalid': resolvedInvalid ? '' : undefined,
    'data-focus': isFocused ? '' : undefined,
    'data-hover': isHovered ? '' : undefined,
    'data-active': isActive ? '' : undefined,
    className,
    style,
    onClick,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    ...safeProps,
  } as ButtonProps<T>;

  return (
    <>
      <Button {...buttonProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Button>
      {name && (
        <input
          {...hiddenInputProps}
          name={name}
          value={value}
          form={form}
          required={resolvedRequired}
          disabled={resolvedDisabled}
        />
      )}
    </>
  );
};

Switch.displayName = 'Switch';
