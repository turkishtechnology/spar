import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useId,
} from 'react';
import type { RadioGroupProps, RadioItemProps, RadioGroupContextValue, Orientation } from './types';

// Context for RadioGroup
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioItem must be used within a RadioGroup');
  }
  return context;
};

// Custom hook for controlled/uncontrolled state
function useControlledState(
  controlledValue: string | undefined,
  defaultValue: string | undefined,
  onChange: ((value: string) => void) | undefined,
): [string | undefined, (value: string) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}

/**
 * RadioGroup component for creating mutually exclusive radio button groups.
 * Implements WCAG 2.2 AA standards with full keyboard navigation and accessibility features.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      name: nameProp,
      disabled = false,
      required = false,
      orientation = 'vertical' as Orientation,
      isInToolbar = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      as: Component = 'div',
      children,
      ...rest
    },
    ref,
  ) => {
    const [value, setValue] = useControlledState(controlledValue, defaultValue, onValueChange);
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const [items, setItems] = useState<string[]>([]);
    const generatedId = useId();
    const name = nameProp || `radio-group-${generatedId}`;

    // Register/unregister items
    const registerItem = useCallback((itemValue: string) => {
      setItems((prev) => [...prev.filter((v) => v !== itemValue), itemValue]);
    }, []);

    const unregisterItem = useCallback((itemValue: string) => {
      setItems((prev) => prev.filter((v) => v !== itemValue));
    }, []);

    const getItems = useCallback(() => items, [items]);

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
        if (disabled || items.length === 0) return;

        const currentIndex = items.indexOf(focusedValue || value || '');
        let nextIndex = -1;

        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault();
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            break;
          case 'Home':
            event.preventDefault();
            nextIndex = 0;
            break;
          case 'End':
            event.preventDefault();
            nextIndex = items.length - 1;
            break;
          default:
            return;
        }

        if (nextIndex !== -1 && items[nextIndex]) {
          const nextValue = items[nextIndex];
          if (nextValue) {
            if (isInToolbar) {
              // Toolbar behavior: Arrow keys only move focus
              handleFocusMove(nextValue);
            } else {
              // Standard behavior: Arrow keys move focus and select
              handleValueChange(nextValue);
            }
          }
        }
      },
      [disabled, items, focusedValue, value, isInToolbar, handleFocusMove, handleValueChange],
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
      getItems,
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
          {...dataAttributes}
          {...rest}
        >
          {children}
          {/* Hidden input for form submission */}
          {value && <input type='hidden' name={name} value={value} disabled={disabled} />}
        </Component>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

/**
 * RadioItem component representing individual radio options within a RadioGroup.
 * Implements roving tabindex and full accessibility features.
 */
export const RadioItem = forwardRef<HTMLLabelElement, RadioItemProps>(
  (
    {
      value: itemValue,
      disabled: itemDisabled = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      as: Component = 'label',
      children,
      ...rest
    },
    ref,
  ) => {
    const context = useRadioGroupContext();
    const {
      value: groupValue,
      onValueChange,
      disabled: groupDisabled,
      name,
      focusedValue,
      setFocusedValue,
      registerItem,
      unregisterItem,
    } = context;

    const itemRef = useRef<HTMLElement>(null);
    const isChecked = groupValue === itemValue;
    const isDisabled = groupDisabled || itemDisabled;
    const isFocusable = !isDisabled && (isChecked || (!groupValue && focusedValue === itemValue));

    // Register/unregister with group
    useEffect(() => {
      registerItem(itemValue);
      return () => unregisterItem(itemValue);
    }, [itemValue, registerItem, unregisterItem]);

    // Focus management
    useEffect(() => {
      if (focusedValue === itemValue && itemRef.current) {
        itemRef.current.focus();
      }
    }, [focusedValue, itemValue]);

    // Handle selection
    const handleClick = useCallback(() => {
      if (!isDisabled) {
        onValueChange(itemValue);
      }
    }, [isDisabled, onValueChange, itemValue]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    const handleFocus = useCallback(() => {
      if (!isDisabled) {
        setFocusedValue(itemValue);
      }
    }, [isDisabled, setFocusedValue, itemValue]);

    // Merge refs
    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        itemRef.current = node;
        if (typeof ref === 'function') {
          ref(node as HTMLLabelElement | null);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref],
    );

    // Data attributes for styling
    const dataAttributes = {
      'data-state': isChecked ? 'checked' : 'unchecked',
      'data-disabled': isDisabled || undefined,
      'data-focused': focusedValue === itemValue || undefined,
    };

    return (
      <Component
        ref={mergedRef}
        role='radio'
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={isFocusable ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...dataAttributes}
        {...rest}
      >
        {children}
        {/* Hidden radio input for form submission and accessibility */}
        <input
          type='radio'
          name={name}
          value={itemValue}
          checked={isChecked}
          disabled={isDisabled}
          tabIndex={-1}
          data-hidden
          onChange={() => {}} // Controlled by parent
        />
      </Component>
    );
  },
);

RadioItem.displayName = 'RadioItem';

/**
 * Compound Radio component with Group and Item subcomponents.
 */
export const Radio = {
  Group: RadioGroup,
  Item: RadioItem,
};
