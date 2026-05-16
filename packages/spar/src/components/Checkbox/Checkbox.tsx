import { useId, useState, useRef, useEffect, useMemo, type ElementType } from 'react';
import { useMergedRef, useAutoFocus, useControlledState } from '@/hooks';
import { visuallyHidden } from '@/utils';
import { useOptionalFieldContext } from '../Field/hooks';
import type { CheckboxProps, CheckboxRenderProps } from './types';
import type { CheckedState } from '../../types';

/**
 * Headless checkbox component providing accessibility and behavior without styling.
 * Supports dual-state and tri-state functionality with complete ARIA compliance.
 *
 * When nested inside a `<Field>`, it reads the Field's `invalid`, `disabled`,
 * `required` and `readOnly` values automatically. Direct props on `<Checkbox>`
 * override the inherited values.
 */
export const Checkbox = <T extends ElementType = 'span'>({
  as,
  ref,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  isInvalid,
  disabled,
  readOnly,
  required,
  name,
  value = 'on',
  form,
  autoFocus = false,
  children,
  id: providedId,
  className,
  style,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  tabIndex = 0,
  ...restProps
}: CheckboxProps<T>) => {
  const Component = as || 'span';
  // Generate stable ID
  const generatedId = useId();
  const id = providedId ?? generatedId;

  // Field context integration — direct props win over inherited Field values.
  const fieldCtx = useOptionalFieldContext();
  const resolvedInvalid = isInvalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  // State management - controlled/uncontrolled
  const [checked = defaultChecked, updateChecked] = useControlledState<CheckedState>(
    controlledChecked,
    defaultChecked,
    onChange,
  );

  // Interaction state
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Refs
  const elementRef = useRef<HTMLElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(elementRef, ref);

  // Auto focus on mount
  useAutoFocus(elementRef, autoFocus);

  // Sync hidden input with checkbox state
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.checked = checked === true;
      hiddenInputRef.current.indeterminate = checked === 'indeterminate';
    }
  }, [checked]);

  // Toggle checked state
  const handleToggleChecked = () => {
    if (resolvedDisabled || resolvedReadOnly) return;

    const newChecked: CheckedState = checked === 'indeterminate' ? true : !checked;
    updateChecked(newChecked);
  };

  // Event handlers
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    handleToggleChecked();
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Space key toggles the checkbox
    if (event.key === ' ') {
      event.preventDefault();
      handleToggleChecked();
    }

    // Enter key submits form (if in form) - no state change
    if (event.key === 'Enter') {
      const form = elementRef.current?.closest('form');
      if (form) {
        event.preventDefault();
        form.requestSubmit();
      }
    }

    onKeyDown?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleMouseEnter = () => {
    if (!resolvedDisabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!resolvedDisabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Data attributes for styling
  const dataAttributes: Record<string, string | undefined> = {
    'data-state':
      checked === 'indeterminate' ? 'indeterminate' : checked === true ? 'checked' : 'unchecked',
    'data-checked': checked === true ? '' : undefined,
    'data-indeterminate': checked === 'indeterminate' ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
    'data-focus': isFocused ? '' : undefined,
    'data-hover': isHovered ? '' : undefined,
    'data-active': isPressed ? '' : undefined,
    'data-invalid': resolvedInvalid ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
  };

  // Function to programmatically set checked state
  const setCheckedState = (newChecked: CheckedState) => {
    if (resolvedDisabled || resolvedReadOnly) return;
    updateChecked(newChecked);
  };

  // Render props for children function
  const renderProps: CheckboxRenderProps = {
    checked,
    setChecked: setCheckedState,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    required: resolvedRequired,
    isInvalid: resolvedInvalid,
    isFocused,
    isHovered,
    isPressed,
  };

  // ARIA attributes
  const ariaAttributes = useMemo(() => {
    const attrs: Record<string, boolean | string> = {
      role: 'checkbox',
      'aria-checked': checked === 'indeterminate' ? 'mixed' : checked,
    };

    // Disabled state - only add aria-disabled for non-native button elements
    if (resolvedDisabled && Component !== 'button') {
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

    // Wire ARIA relationships from Field context
    if (fieldCtx) {
      attrs['aria-labelledby'] = fieldCtx.labelId;
      attrs['aria-describedby'] = resolvedInvalid ? fieldCtx.errorId : fieldCtx.descriptionId;
    }

    return attrs;
  }, [
    checked,
    resolvedDisabled,
    resolvedReadOnly,
    resolvedRequired,
    resolvedInvalid,
    Component,
    fieldCtx,
  ]);

  // Build props for the element
  const isNativeButton = Component === 'button';
  const elementProps: Record<string, unknown> = {
    ref: mergedRef,
    className,
    style,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    ...restProps,
    // ID and ARIA/data attributes must win over user-supplied restProps to
    // preserve accessibility semantics and Field context wiring.
    id: fieldCtx?.fieldId ?? id,
    ...dataAttributes,
    ...ariaAttributes,
    tabIndex: resolvedDisabled ? -1 : tabIndex,
  };

  // Add button-specific props when rendering as button
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = 'button';
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = resolvedDisabled;
    if ('aria-disabled' in elementProps) {
      delete elementProps['aria-disabled'];
    }
  } else {
    if ('disabled' in elementProps) {
      delete elementProps['disabled'];
    }
    if ('type' in elementProps) {
      delete elementProps['type'];
    }
  }

  return (
    <>
      <Component {...elementProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>

      {/* Hidden input for form integration */}
      {name && (
        <input
          ref={hiddenInputRef}
          type='checkbox'
          name={name}
          value={value}
          form={form}
          required={resolvedRequired}
          disabled={resolvedDisabled}
          checked={checked === true}
          onChange={() => {}} // Controlled by main component
          style={visuallyHidden}
          tabIndex={-1}
          aria-hidden='true'
        />
      )}
    </>
  );
};

Checkbox.displayName = 'Checkbox';
