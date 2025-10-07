import { useState, useCallback } from 'react';

/**
 * A hook that manages controlled and uncontrolled state patterns.
 * Handles both controlled (value prop) and uncontrolled (defaultValue prop) modes.
 *
 * @param controlledValue - The controlled value from props
 * @param defaultValue - The default value for uncontrolled mode
 * @param onChange - Callback function when value changes
 * @returns A tuple of [currentValue, setValue] similar to useState
 */
export function useControlledState<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  onChange: ((value: T) => void) | undefined,
): [T | undefined, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}
