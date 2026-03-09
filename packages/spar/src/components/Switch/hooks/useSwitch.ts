import { useState, useCallback } from 'react';
import { useControlledState } from '@/hooks';
import { visuallyHidden } from '@/utils';
import type { UseSwitchProps, UseSwitchReturn } from '../types';

/**
 * Custom hook for managing switch state and behavior
 */
export const useSwitch = (props: UseSwitchProps): UseSwitchReturn => {
  const {
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    readOnly = false,
  } = props;

  // State management - controlled/uncontrolled
  const [checked = false, setCheckedValue] = useControlledState(
    controlledChecked,
    defaultChecked,
    onChange,
  );

  // State for interaction tracking
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Toggle function
  const handleToggle = useCallback(() => {
    if (disabled || readOnly) return;
    setCheckedValue(!checked);
  }, [checked, disabled, readOnly, setCheckedValue]);

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
    style: visuallyHidden,
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
      setCheckedValue(newChecked);
    },
    switchProps,
    hiddenInputProps,
  };
};
