import React, {
  useState,
  useCallback,
  useId,
  useRef,
  useEffect,
  useMemo,
  ElementType,
} from 'react';
import { useControlledState, useItemRegistry } from '@/hooks';
import { RadioGroupContext } from './hooks';
import type { RadioGroupProps, RadioGroupContextValue } from './types';

/**
 * RadioGroup component for creating mutually exclusive radio button groups.
 * Implements WCAG 2.2 AA standards with full keyboard navigation and accessibility features.
 */
export const RadioGroup = <T extends ElementType = 'div'>({
  ref,
  id: providedId,
  value: controlledValue,
  defaultValue,
  onValueChange,
  name: nameProp,
  disabled = false,
  required = false,
  orientation = 'vertical',
  selectOnFocus = true,
  autoFocus = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  as,
  children,
  ...rest
}: RadioGroupProps<T>) => {
  const Component = as || 'div';
  const [value, setValue] = useControlledState(controlledValue, defaultValue, onValueChange);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const {
    items: radioItems,
    registerItem,
    unregisterItem,
    getItemIndex,
    getItemAtIndex,
    count,
  } = useItemRegistry<HTMLElement>();
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const name = nameProp ?? `${baseId}-radio-group`;
  const hasAutoFocused = useRef(false);

  const focusItemAtIndex = useCallback(
    (index: number): void => {
      const key = getItemAtIndex(index);
      if (key !== undefined) {
        radioItems.get(key)?.focus();
      }
    },
    [radioItems, getItemAtIndex],
  );

  // Auto focus first item on mount
  useEffect(() => {
    if (autoFocus && !disabled && count > 0 && !hasAutoFocused.current) {
      hasAutoFocused.current = true;
      // Focus the selected item, or the first item if none selected
      const itemToFocus = value || getItemAtIndex(0);
      if (itemToFocus) {
        radioItems.get(itemToFocus)?.focus();
      }
    }
  }, [autoFocus, disabled, count, value, getItemAtIndex, radioItems]);

  // Handle value changes
  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setFocusedValue(newValue);
    },
    [setValue],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle navigation keys, not selection keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }

      if (count === 0) return;

      const currentIndex = focusedValue ? getItemIndex(focusedValue) : -1;
      let nextIndex: number | undefined;
      const isVertical = orientation === 'vertical';

      switch (event.key) {
        case 'ArrowUp':
          if (isVertical) {
            nextIndex = currentIndex <= 0 ? count - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (isVertical) {
            nextIndex = currentIndex >= count - 1 ? 0 : currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (!isVertical) {
            nextIndex = currentIndex <= 0 ? count - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (!isVertical) {
            nextIndex = currentIndex >= count - 1 ? 0 : currentIndex + 1;
          }
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = count - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== undefined) {
        event.preventDefault();
        const nextValue = getItemAtIndex(nextIndex);
        if (nextValue) {
          // Imperatively focus — RadioItem's onFocus updates focusedValue state
          focusItemAtIndex(nextIndex);

          // When selectOnFocus is true, arrow keys also change selection
          // When false, only Space/Enter changes selection
          if (selectOnFocus) {
            handleValueChange(nextValue);
          }
        }
      }
    },
    [
      count,
      focusedValue,
      getItemIndex,
      getItemAtIndex,
      orientation,
      focusItemAtIndex,
      selectOnFocus,
      handleValueChange,
    ],
  );

  // Focus management: sync focusedValue state when user tabs into the group
  // (browser already focused the tabIndex=0 element; we just track which one)
  const handleFocus = useCallback(
    (_event: React.FocusEvent) => {
      // Only set initial focus when user tabs into the group
      if (focusedValue === null && count > 0) {
        const initialFocus = value || getItemAtIndex(0);
        if (initialFocus) {
          setFocusedValue(initialFocus);
        }
      }
    },
    [focusedValue, count, value, getItemAtIndex],
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      value,
      onValueChange: handleValueChange,
      disabled,
      name,
      focusedValue,
      setFocusedValue,
      orientation,
      selectOnFocus,
      registerItem,
      unregisterItem,
    }),
    [
      value,
      handleValueChange,
      disabled,
      name,
      focusedValue,
      setFocusedValue,
      orientation,
      selectOnFocus,
      registerItem,
      unregisterItem,
    ],
  );

  // Data attributes for styling
  const dataAttributes = {
    'data-orientation': orientation,
    'data-disabled': disabled ? '' : undefined,
    'data-required': required ? '' : undefined,
    'data-select-on-focus': selectOnFocus ? '' : undefined,
    'data-autofocus': autoFocus ? '' : undefined,
  };

  const ariaAttributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-required': required || undefined,
  };

  const groupProps = {
    ref,
    role: 'radiogroup',
    ...ariaAttributes,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    ...dataAttributes,
    ...rest,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <Component {...groupProps}>
        {children}
        {/* Hidden input for form submission */}
        {value && (
          <input
            type='hidden'
            name={name}
            value={value}
            disabled={disabled}
            data-disabled={disabled ? '' : undefined}
          />
        )}
      </Component>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';
