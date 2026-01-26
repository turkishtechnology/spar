import { useState, useCallback, useId, useRef } from 'react';
import { useMergedRef, useAutoFocus } from '../../hooks';
import type { SwitchProps, SwitchRenderProps, UseSwitchProps, UseSwitchReturn } from './types';

/**
 * Custom hook for managing switch state and behavior
 */
const useSwitch = (props: UseSwitchProps): UseSwitchReturn => {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    readOnly = false,
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
    if (disabled || readOnly) return;

    const newChecked = !checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
  }, [checked, disabled, readOnly, isControlled, onChange]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || readOnly) return;

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleToggle();
      }
    },
    [disabled, readOnly, handleToggle],
  );

  // Click event handler
  const handleClick = useCallback(
    (_event: React.MouseEvent) => {
      if (disabled || readOnly) return;

      handleToggle();
    },
    [disabled, readOnly, handleToggle],
  );

  // Focus event handlers
  const handleFocus = useCallback(
    (_event: React.FocusEvent) => {
      if (disabled) return;
      setIsFocused(true);
    },
    [disabled],
  );

  const handleBlur = useCallback((_event: React.FocusEvent) => {
    setIsFocused(false);
  }, []);

  // Pointer event handlers (mouse + touch unified)
  const handlePointerEnter = useCallback(
    (_event: React.PointerEvent) => {
      if (disabled) return;
      setIsHovered(true);
    },
    [disabled],
  );

  const handlePointerLeave = useCallback((_event: React.PointerEvent) => {
    setIsHovered(false);
    setIsActive(false);
  }, []);

  const handlePointerDown = useCallback(
    (_event: React.PointerEvent) => {
      if (disabled || readOnly) return;
      setIsActive(true);
    },
    [disabled, readOnly],
  );

  const handlePointerUp = useCallback((_event: React.PointerEvent) => {
    setIsActive(false);
  }, []);

  const handlePointerCancel = useCallback((_event: React.PointerEvent) => {
    setIsActive(false);
    setIsHovered(false);
  }, []);

  // Generate switch props
  const switchProps = {
    role: 'switch' as const,
    'aria-checked': checked,
    ...(readOnly && { 'aria-readonly': true }),
    'data-switch': '' as const,
    'data-state': checked ? ('checked' as const) : ('unchecked' as const),
    ...(checked && { 'data-checked': '' as const }),
    ...(disabled && { 'data-disabled': '' as const }),
    ...(readOnly && { 'data-readonly': '' as const }),
    ...(isFocused && { 'data-focus': '' as const }),
    ...(isHovered && { 'data-hover': '' as const }),
    ...(isActive && { 'data-active': '' as const }),
    tabIndex: disabled ? -1 : 0,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
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
    disabled,
    readOnly,
    isFocused,
    isHovered,
    isActive,
    setChecked: (newChecked: boolean) => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    },
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
  disabled = false,
  name,
  value = 'on',
  form,
  required = false,
  readOnly = false,
  shouldAutoFocus = false,
  id: providedId,
  children,
  ref,
  ...restProps
}: SwitchProps) => {
  const internalId = useId();
  const id = providedId || internalId;

  // Refs
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref as React.Ref<HTMLElement>);

  // Auto focus handling
  useAutoFocus(internalRef, shouldAutoFocus);

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
    disabled,
    readOnly,
  });

  // Render props for children function
  const renderProps: SwitchRenderProps = {
    checked: checkedState,
    setChecked,
    disabled,
    readOnly,
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

  const isNativeButton = Component === 'button';
  // Remove native disabled/type for non-button
  const componentProps: Record<string, unknown> = {
    ...switchProps,
    ...safeProps,
    ref: mergedRef,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    style,
    ...(required && { 'aria-required': true }),
    ...(required && { 'data-required': '' }),
  };
  if (isNativeButton) {
    componentProps['disabled'] = disabled;
    componentProps['type'] = 'button';
  } else {
    componentProps['role'] = 'switch';
    if (disabled) {
      componentProps['aria-disabled'] = true;
    }
    if ('disabled' in componentProps) {
      delete componentProps['disabled'];
    }
    if ('type' in componentProps) {
      delete componentProps['type'];
    }
  }
  return (
    <>
      <Component {...componentProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
      {name && (
        <input {...hiddenInputProps} name={name} value={value} form={form} required={required} />
      )}
    </>
  );
};

Switch.displayName = 'Switch';
