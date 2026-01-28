import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  useRef,
  useEffect,
  ElementType,
} from 'react';
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
export const RadioGroup = <T extends ElementType = 'div'>({
  ref,
  value: controlledValue,
  defaultValue,
  onValueChange,
  name: nameProp,
  disabled = false,
  required = false,
  orientation = 'vertical',
  isInToolbar = false,
  shouldAutoFocus = false,
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
  const { registerItem, unregisterItem, getItemIds } = useItemRegistry<void>();
  const items = getItemIds(); // Get items as array for navigation
  const generatedId = useId();
  const name = nameProp || `radio-group-${generatedId}`;
  const hasAutoFocused = useRef(false);

  // Auto focus first item on mount
  useEffect(() => {
    if (shouldAutoFocus && !disabled && items.length > 0 && !hasAutoFocused.current) {
      hasAutoFocused.current = true;
      // Focus the selected item, or the first item if none selected
      const itemToFocus = value || items[0];
      if (itemToFocus) {
        setFocusedValue(itemToFocus);
      }
    }
  }, [shouldAutoFocus, disabled, items, value]);

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

      if (items.length === 0) return;

      const currentIndex = focusedValue ? items.indexOf(focusedValue) : -1;
      let nextIndex: number | undefined;
      const isVertical = orientation === 'vertical';

      switch (event.key) {
        case 'ArrowUp':
          if (isVertical) {
            nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (isVertical) {
            nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (!isVertical) {
            nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (!isVertical) {
            nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
          }
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

      if (nextIndex !== undefined) {
        event.preventDefault();
        const nextValue = items[nextIndex];
        if (nextValue) {
          handleFocusMove(nextValue);

          // In normal mode (not toolbar), arrow keys also change selection
          // In toolbar mode, only Space/Enter changes selection
          if (!isInToolbar) {
            handleValueChange(nextValue);
          }
        }
      }
    },
    [items, focusedValue, orientation, handleFocusMove, isInToolbar, handleValueChange],
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
    'data-disabled': disabled ? '' : undefined,
    'data-required': required ? '' : undefined,
    'data-toolbar': isInToolbar ? '' : undefined,
    'data-autofocus': shouldAutoFocus ? '' : undefined,
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
