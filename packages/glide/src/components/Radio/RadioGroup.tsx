import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { useControlledState, useItemRegistry } from '@/hooks';
import type { RadioGroupProps, RadioGroupContextValue } from './types';

// Context for RadioGroup
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioItem must be used within a RadioGroup');
  }
  return context;
};

/**
 * RadioGroup component for creating mutually exclusive radio button groups.
 * Implements WCAG 2.2 AA standards with full keyboard navigation and accessibility features.
 */
export const RadioGroup = ({
  ref,
  value: controlledValue,
  defaultValue,
  onValueChange,
  name: nameProp,
  disabled = false,
  required = false,
  orientation = 'vertical',
  isInToolbar = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  as: Component = 'div',
  children,
  ...rest
}: RadioGroupProps) => {
  const [value, setValue] = useControlledState(controlledValue, defaultValue, onValueChange);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const { registerItem, unregisterItem, getItemIds } = useItemRegistry<void>();
  const items = getItemIds(); // Get items as array for navigation
  const generatedId = useId();
  const name = nameProp || `radio-group-${generatedId}`;

  // Handle value changes
  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setFocusedValue(newValue);
    },
    [setValue],
  );

  // Handle focus movement (separate from selection)
  const handleFocusMove = useCallback((newValue: string) => {
    setFocusedValue(newValue);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle navigation keys, not selection keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }

      event.preventDefault();

      if (items.length === 0) return;

      const currentIndex = focusedValue ? items.indexOf(focusedValue) : -1;
      let nextIndex: number;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      const nextValue = items[nextIndex];
      if (nextValue) {
        handleFocusMove(nextValue);

        // In normal mode (not toolbar), arrow keys also change selection
        // In toolbar mode, only Space/Enter changes selection
        if (!isInToolbar) {
          handleValueChange(nextValue);
        }
      }
    },
    [items, focusedValue, handleFocusMove, isInToolbar, handleValueChange],
  );

  // Focus management: Only set focus on user interaction (Tab into group)
  const handleFocus = useCallback(
    (_event: React.FocusEvent) => {
      // Only set initial focus when user tabs into the group
      if (focusedValue === null && items.length > 0) {
        const initialFocus = value || items[0];
        if (initialFocus) {
          setFocusedValue(initialFocus);
        }
      }
    },
    [focusedValue, items, value],
  );

  const contextValue: RadioGroupContextValue = {
    value,
    onValueChange: handleValueChange,
    disabled,
    name,
    focusedValue,
    setFocusedValue,
    orientation,
    isInToolbar,
    registerItem,
    unregisterItem,
  };

  // Data attributes for styling
  const dataAttributes = {
    'data-orientation': orientation,
    'data-disabled': disabled || undefined,
    'data-required': required || undefined,
    'data-toolbar': isInToolbar || undefined,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <Component
        ref={ref}
        role='radiogroup'
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={required || undefined}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...dataAttributes}
        {...rest}
      >
        {children}
        {/* Hidden input for form submission */}
        {value && <input type='hidden' name={name} value={value} disabled={disabled} />}
      </Component>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';
