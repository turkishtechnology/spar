import { useEffect, useId, useMemo, useRef, type ElementType } from 'react';
import { useAutoFocus, useMergedRef } from '@/hooks';
import { visuallyHidden } from '@/utils';
import { useOptionalFieldContext } from '../Field/hooks';
import { useSwitch } from './hooks';
import type { SwitchProps, SwitchRenderProps } from './types';

/**
 * Headless switch component for boolean toggle controls. Provides accessible
 * switch semantics with form integration and Field context awareness.
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
  disabled,
  readOnly,
  required,
  invalid,
  name,
  value = 'on',
  form,
  autoFocus = false,
  id: providedId,
  children,
  ref,
  className,
  style,
  ...restProps
}: SwitchProps<T>) => {
  const Component = (as || 'button') as ElementType;
  const isNativeButton = Component === 'button';

  const generatedId = useId();
  const id = providedId ?? generatedId;

  // Field context integration — direct props win over inherited Field values.
  const fieldCtx = useOptionalFieldContext();
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedInvalid = invalid ?? fieldCtx?.invalid ?? false;

  const elementRef = useRef<HTMLElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(elementRef, ref);

  useAutoFocus(elementRef, autoFocus);

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

  // Keep the hidden form input in sync with the visible control.
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.checked = checkedState;
    }
  }, [checkedState]);

  const renderProps: SwitchRenderProps = {
    checked: checkedState,
    setChecked,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    required: resolvedRequired,
    invalid: resolvedInvalid,
    isFocused,
    isHovered,
    isPressed: isActive,
  };

  const ariaAttributes = useMemo(() => {
    const attrs: Record<string, boolean | string> = {
      role: 'switch',
      'aria-checked': checkedState,
    };

    if (resolvedDisabled && !isNativeButton) {
      attrs['aria-disabled'] = true;
    }
    if (resolvedReadOnly) {
      attrs['aria-readonly'] = true;
    }
    if (resolvedRequired) {
      attrs['aria-required'] = true;
    }
    if (resolvedInvalid) {
      attrs['aria-invalid'] = true;
    }
    if (fieldCtx) {
      attrs['aria-labelledby'] = fieldCtx.labelId;
      attrs['aria-describedby'] = resolvedInvalid ? fieldCtx.errorId : fieldCtx.descriptionId;
    }
    return attrs;
  }, [
    checkedState,
    resolvedDisabled,
    resolvedReadOnly,
    resolvedRequired,
    resolvedInvalid,
    isNativeButton,
    fieldCtx,
  ]);

  const elementProps: Record<string, unknown> = {
    ref: mergedRef,
    className,
    style,
    ...restProps,
    id: fieldCtx?.fieldId ?? id,
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
    tabIndex: resolvedDisabled ? -1 : 0,
    onClick: switchProps.onClick,
    onKeyDown: switchProps.onKeyDown,
    onFocus: switchProps.onFocus,
    onBlur: switchProps.onBlur,
    onPointerEnter: switchProps.onPointerEnter,
    onPointerLeave: switchProps.onPointerLeave,
    onPointerDown: switchProps.onPointerDown,
    onPointerUp: switchProps.onPointerUp,
    onPointerCancel: switchProps.onPointerCancel,
    ...ariaAttributes,
  };

  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = 'button';
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = resolvedDisabled;
  }

  return (
    <>
      <Component {...elementProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
      {name && (
        <input
          {...hiddenInputProps}
          ref={hiddenInputRef}
          name={name}
          value={value}
          form={form}
          required={resolvedRequired}
          disabled={resolvedDisabled}
          style={visuallyHidden}
        />
      )}
    </>
  );
};

Switch.displayName = 'Switch';
