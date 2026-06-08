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
import { RadioContext } from './hooks';
import { useOptionalFieldContext } from '../Field/hooks';
import type { RadioProps, RadioContextValue } from './types';

/**
 * Radio component for creating mutually exclusive radio button groups
 * (renders `role="radiogroup"`). Implements WCAG 2.2 AA standards with full
 * keyboard navigation and accessibility features.
 *
 * When nested inside a `<Field>`, it reads the Field's `invalid`, `disabled`,
 * and `required` values automatically, and inherits the coordinated ARIA IDs
 * so FieldLabel / FieldDescription / FieldErrorMessage wire to the radiogroup
 * without extra plumbing. Direct props on `<Radio>` override the inherited
 * values.
 */
export const Radio = <T extends ElementType = 'div'>({
  ref,
  id: providedId,
  value: controlledValue,
  defaultValue,
  onChange,
  name: nameProp,
  disabled,
  readOnly,
  required,
  invalid,
  orientation = 'vertical',
  selectOnFocus = true,
  autoFocus = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  as,
  children,
  ...rest
}: RadioProps<T>) => {
  const Component = as || 'div';
  const fieldCtx = useOptionalFieldContext();

  // Direct props win; otherwise fall back to Field context; then default false.
  const resolvedInvalid = invalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  const [value, setValue] = useControlledState(controlledValue, defaultValue, onChange);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const {
    items: radioItems,
    registerItem: registerEnabledItem,
    unregisterItem,
    getItemIndex,
    getItemAtIndex,
    count,
  } = useItemRegistry<HTMLElement>();
  const generatedId = useId();
  // Reuse Field's coordinated fieldId when nested so FieldLabel's htmlFor and
  // aria-labelledby resolve against the radiogroup element.
  const baseId = fieldCtx?.fieldId ?? providedId ?? generatedId;
  const name = nameProp ?? `${baseId}-radio-group`;
  const hasAutoFocused = useRef(false);

  const registerItem = useCallback(
    (itemValue: string, element: HTMLElement, itemDisabled: boolean): void => {
      if (itemDisabled) {
        unregisterItem(itemValue);
        return;
      }

      registerEnabledItem(itemValue, element);
    },
    [registerEnabledItem, unregisterItem],
  );

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
    if (autoFocus && !resolvedDisabled && count > 0 && !hasAutoFocused.current) {
      hasAutoFocused.current = true;
      // Focus the selected item, or the first item if none selected
      const itemToFocus = value || getItemAtIndex(0);
      if (itemToFocus) {
        radioItems.get(itemToFocus)?.focus();
      }
    }
  }, [autoFocus, resolvedDisabled, count, value, getItemAtIndex, radioItems]);

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

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex <= 0 ? count - 1 : currentIndex - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = currentIndex >= count - 1 ? 0 : currentIndex + 1;
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
      focusItemAtIndex,
      selectOnFocus,
      handleValueChange,
    ],
  );

  // Focus management: sync focusedValue state when user tabs into the group
  // (browser already focused the tabIndex=0 element; we just track which one)
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Only set initial focus when user tabs into the group
      if (focusedValue === null && count > 0) {
        const initialFocus = value || getItemAtIndex(0);
        if (initialFocus) {
          setFocusedValue(initialFocus);
        }
      }
      onFocus?.(event);
    },
    [focusedValue, count, value, getItemAtIndex, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const nextFocusedElement = event.relatedTarget as Node | null;
      if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
        setFocusedValue(null);
      }
      onBlur?.(event);
    },
    [onBlur],
  );

  const contextValue = useMemo<RadioContextValue>(
    () => ({
      value,
      onChange: handleValueChange,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      required: resolvedRequired,
      name,
      firstFocusableValue: getItemAtIndex(0) ?? null,
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
      resolvedDisabled,
      resolvedReadOnly,
      resolvedRequired,
      name,
      getItemAtIndex,
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
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-invalid': resolvedInvalid ? '' : undefined,
    'data-select-on-focus': selectOnFocus ? '' : undefined,
    'data-autofocus': autoFocus ? '' : undefined,
  };

  // When inside a Field, default the ARIA wiring from Field's coordinated IDs.
  // Consumer-provided aria-* props always win.
  const fieldDescribedBy = fieldCtx
    ? resolvedInvalid
      ? fieldCtx.errorId
      : fieldCtx.descriptionId
    : undefined;

  const ariaAttributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy ?? fieldCtx?.labelId,
    'aria-describedby': ariaDescribedBy ?? fieldDescribedBy,
    'aria-required': resolvedRequired || undefined,
    'aria-invalid': resolvedInvalid || undefined,
  };

  const groupProps = {
    id: baseId,
    ref,
    role: 'radiogroup',
    ...ariaAttributes,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...dataAttributes,
    ...rest,
  };

  return (
    <RadioContext.Provider value={contextValue}>
      <Component {...groupProps}>
        {children}
        {/* Hidden input for form submission */}
        {value && (
          <input
            type='hidden'
            name={name}
            value={value}
            disabled={resolvedDisabled}
            data-disabled={resolvedDisabled ? '' : undefined}
          />
        )}
      </Component>
    </RadioContext.Provider>
  );
};

Radio.displayName = 'Radio';
