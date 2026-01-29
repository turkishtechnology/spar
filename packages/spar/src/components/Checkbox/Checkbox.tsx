import { useId, useState, useRef, useEffect, ElementType } from 'react';
import { useMergedRef, useAutoFocus } from '../../hooks';
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

  // State management - controlled vs uncontrolled
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState<CheckedState>(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

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

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
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

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
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
    ...restProps,
    tabIndex: disabled ? -1 : tabIndex,
  };
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = 'button';
    elementProps['role'] = 'checkbox';
    elementProps['aria-checked'] = checked === 'indeterminate' ? 'mixed' : checked;
    elementProps['aria-readonly'] = readOnly || undefined;
    elementProps['aria-invalid'] = undefined;
    elementProps['aria-required'] = required || undefined;
    // Remove aria-disabled for native button
    if ('aria-disabled' in elementProps) {
      delete elementProps['aria-disabled'];
    }
  } else {
    elementProps['role'] = 'checkbox';
    elementProps['aria-checked'] = checked === 'indeterminate' ? 'mixed' : checked;
    elementProps['aria-disabled'] = disabled || undefined;
    elementProps['aria-readonly'] = readOnly || undefined;
    elementProps['aria-invalid'] = undefined;
    elementProps['aria-required'] = required || undefined;
    // Remove native disabled/type if present
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
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
          tabIndex={-1}
          aria-hidden='true'
        />
      )}
    </>
  );
};

Checkbox.displayName = 'Checkbox';
