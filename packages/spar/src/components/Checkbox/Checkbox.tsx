import { useId, useState, useRef, useEffect } from 'react';
import type { CheckboxProps, CheckboxRenderProps } from './types';
import type { CheckedState } from '../../types';

/**
 * Headless checkbox component providing accessibility and behavior without styling.
 * Supports dual-state and tri-state functionality with complete ARIA compliance.
 */
export const Checkbox = ({
  as: Component = 'span',
  ref,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  value = 'on',
  form,
  shouldAutoFocus = false,
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
}: CheckboxProps) => {
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

  // Auto focus on mount
  useEffect(() => {
    if (shouldAutoFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldAutoFocus]);

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

    onCheckedChange?.(newChecked);
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

  // ARIA attributes
  const ariaAttributes = {
    role: 'checkbox',
    'aria-checked': checked === 'indeterminate' ? 'mixed' : checked,
    'aria-disabled': disabled || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': undefined, // Will be set by validation logic
    'aria-required': required || undefined,
    tabIndex: disabled ? -1 : tabIndex,
  };

  // Render props for children function
  const renderProps: CheckboxRenderProps = {
    checked,
    disabled,
    isFocused,
    isHovered,
    isPressed,
  };

  // Extract known props to avoid spreading to DOM
  return (
    <>
      <Component
        ref={ref}
        id={id}
        className={className}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...ariaAttributes}
        {...dataAttributes}
        {...restProps}
      >
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
