import { useState, useCallback, useId } from 'react';
import type { SwitchProps, UseSwitchProps, UseSwitchReturn } from './types';

/**
 * Custom hook for managing switch state and behavior
 */
const useSwitch = (props: UseSwitchProps): UseSwitchReturn => {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    isDisabled = false,
    isReadOnly = false,
  } = props;

  // Determine if component is controlled
  const isControlled = controlledChecked !== undefined;

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);

  // Current checked state (controlled or uncontrolled)
  const checked = isControlled ? controlledChecked : internalChecked;

  // State for interaction tracking
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Toggle function
  const handleToggle = useCallback(() => {
    if (isDisabled || isReadOnly) return;

    const newChecked = !checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
  }, [checked, isDisabled, isReadOnly, isControlled, onChange]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled || isReadOnly) return;

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleToggle();
      }
    },
    [isDisabled, isReadOnly, handleToggle],
  );

  // Click event handler
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled || isReadOnly) return;

      event.preventDefault();
      handleToggle();
    },
    [isDisabled, isReadOnly, handleToggle],
  );

  // Focus event handlers
  const handleFocus = useCallback(
    (_event: React.FocusEvent) => {
      if (isDisabled) return;
      setIsFocused(true);
    },
    [isDisabled],
  );

  const handleBlur = useCallback((_event: React.FocusEvent) => {
    setIsFocused(false);
  }, []);

  // Mouse event handlers
  const handleMouseEnter = useCallback(
    (_event: React.MouseEvent) => {
      if (isDisabled) return;
      setIsHovered(true);
    },
    [isDisabled],
  );

  const handleMouseLeave = useCallback((_event: React.MouseEvent) => {
    setIsHovered(false);
    setIsActive(false);
  }, []);

  const handleMouseDown = useCallback(
    (_event: React.MouseEvent) => {
      if (isDisabled || isReadOnly) return;
      setIsActive(true);
    },
    [isDisabled, isReadOnly],
  );

  const handleMouseUp = useCallback((_event: React.MouseEvent) => {
    setIsActive(false);
  }, []);

  // Generate switch props
  const switchProps = {
    role: 'switch' as const,
    'aria-checked': checked,
    ...(isDisabled && { 'aria-disabled': true }),
    ...(isReadOnly && { 'aria-readonly': true }),
    'data-switch': '' as const,
    'data-state': checked ? ('checked' as 'checked') : ('unchecked' as 'unchecked'),
    ...(checked && { 'data-checked': '' as const }),
    ...(isDisabled && { 'data-disabled': '' as const }),
    ...(isReadOnly && { 'data-readonly': '' as const }),
    ...(isFocused && { 'data-focus': '' as const }),
    ...(isHovered && { 'data-hover': '' as const }),
    ...(isActive && { 'data-active': '' as const }),
    tabIndex: isDisabled ? -1 : 0,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  };

  // Hidden input props for form integration
  const hiddenInputProps = {
    type: 'checkbox' as const,
    checked,
    onChange: () => {}, // Handled by the switch element
    tabIndex: -1 as const,
    'aria-hidden': true as const,
    style: {
      position: 'absolute' as const,
      opacity: 0,
      pointerEvents: 'none' as const,
      margin: 0,
      width: 0,
      height: 0,
    },
  };

  return {
    checked,
    isDisabled,
    isReadOnly,
    switchProps,
    hiddenInputProps,
  };
};

/**
 * Headless switch component for boolean toggle controls. Provides accessible switch semantics with form integration.
 */
export const Switch = ({
  as: Component = 'button',
  checked,
  defaultChecked,
  onChange,
  isDisabled = false,
  name,
  value = 'on',
  form,
  isRequired = false,
  isReadOnly = false,
  shouldAutoFocus = false,
  id: providedId,
  children,
  ...restProps
}: SwitchProps) => {
  const internalId = useId();
  const id = providedId || internalId;

  // Use the switch hook
  const { switchProps, hiddenInputProps } = useSwitch({
    ...(checked !== undefined && { checked }),
    ...(defaultChecked !== undefined && { defaultChecked }),
    ...(onChange && { onChange }),
    isDisabled,
    isReadOnly,
  });

  // Extract known props to prevent conflicts
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    style,
    ...safeProps
  } = restProps;

  return (
    <>
      <Component
        {...switchProps}
        {...safeProps}
        id={id}
        disabled={isDisabled}
        autoFocus={shouldAutoFocus}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={className}
        style={style}
        {...(isRequired && { 'data-required': '' })}
      >
        {children}
      </Component>

      {name && (
        <input {...hiddenInputProps} name={name} value={value} form={form} required={isRequired} />
      )}
    </>
  );
};

Switch.displayName = 'Switch';
