import { useId, useState, useRef, useEffect, useMemo, ElementType } from 'react';
import { useMergedRef, useAutoFocus, useControlledState } from '@/hooks';
import { visuallyHidden } from '@/utils';
import type { CheckboxProps, CheckboxRenderProps } from './types';
import type { CheckedState } from '../../types';

/**
 * Headless checkbox component providing accessibility and behavior without styling.
 * Supports dual-state and tri-state functionality with complete ARIA compliance.
 */
export const Checkbox = <T extends ElementType = 'span'>({
  as,
  ref,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
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
    if (disabled || readOnly) return;

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
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Data attributes for styling
  const dataAttributes: Record<string, string | undefined> = {
    'data-checked': checked === true ? '' : undefined,
    'data-indeterminate': checked === 'indeterminate' ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
    'data-focus': isFocused ? '' : undefined,
    'data-hover': isHovered ? '' : undefined,
    'data-active': isPressed ? '' : undefined,
    'data-invalid': undefined, // Will be set by validation logic
    'data-required': required ? '' : undefined,
  };

  // Function to programmatically set checked state
  const setCheckedState = (newChecked: CheckedState) => {
    if (disabled || readOnly) return;
    updateChecked(newChecked);
  };

  // Render props for children function
  const renderProps: CheckboxRenderProps = {
    checked,
    setChecked: setCheckedState,
    disabled,
    readOnly,
    isFocused,
    isHovered,
    isPressed,
  };

  // ARIA attributes - consistent with Button component pattern
  const ariaAttributes = useMemo(() => {
    const attrs: Record<string, boolean | string> = {
      role: 'checkbox',
      'aria-checked': checked === 'indeterminate' ? 'mixed' : checked,
    };

    // Disabled state - only add aria-disabled for non-native button elements
    // Native buttons already communicate disabled state via the disabled attribute
    if (disabled && Component !== 'button') {
      attrs['aria-disabled'] = true;
    }

    // Read-only state
    if (readOnly) {
      attrs['aria-readonly'] = true;
    }

    // Required state
    if (required) {
      attrs['aria-required'] = true;
    }

    // Invalid state - placeholder for validation logic
    // attrs['aria-invalid'] = false; // Uncomment when validation is implemented

    return attrs;
  }, [checked, disabled, readOnly, required, Component]);

  // Build props for the element
  const isNativeButton = Component === 'button';
  const elementProps: Record<string, unknown> = {
    ref: mergedRef,
    id,
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
    ...dataAttributes,
    ...ariaAttributes,
    ...restProps,
    tabIndex: disabled ? -1 : tabIndex,
  };

  // Add button-specific props when rendering as button
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = 'button';
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
    // Remove aria-disabled if present in restProps (native button uses disabled attribute)
    if ('aria-disabled' in elementProps) {
      delete elementProps['aria-disabled'];
    }
  } else {
    // Remove native disabled and type attributes if present in restProps
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
