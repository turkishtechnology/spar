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
 *
 * Consumer `onKeyDown` / `onFocus` / `onBlur` handlers are composed with the
 * internal ones: the consumer handler runs first, and calling
 * `event.preventDefault()` inside `onKeyDown` vetoes the built-in arrow /
 * Home / End navigation for that key press.
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
  onKeyDown,
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

  // Only enabled items take part in keyboard navigation. The registry orders
  // indexed lookups by DOM position, so an item that toggles `disabled` and
  // re-registers keeps its place in the arrow-key order.
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

  // Roving tabindex: exactly one item is the group's tab stop — the item that
  // currently has focus, else the checked item when it is enabled, else the
  // first enabled item. Before any item has registered (`count === 0`, e.g.
  // the SSR pass) the checked value is trusted so the markup still carries a
  // tab stop.
  const tabStopValue = useMemo<string | null>(() => {
    if (focusedValue !== null) return focusedValue;
    if (value !== undefined && (count === 0 || radioItems.has(value))) return value;
    return getItemAtIndex(0) ?? null;
  }, [focusedValue, value, count, radioItems, getItemAtIndex]);

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

  // Handle value changes. `onChange` fires once per user-visible change, so a
  // request for the value that is already selected only moves the tab stop.
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue !== value) {
        setValue(newValue);
      }
      setFocusedValue(newValue);
    },
    [setValue, value],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

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

          // When selectOnFocus is true, arrow keys also change selection.
          // When false, only Space/Enter changes selection. A read-only group
          // lets focus move but never changes its value.
          if (selectOnFocus && !resolvedReadOnly) {
            handleValueChange(nextValue);
          }
        }
      }
    },
    [
      onKeyDown,
      count,
      focusedValue,
      getItemIndex,
      getItemAtIndex,
      focusItemAtIndex,
      selectOnFocus,
      resolvedReadOnly,
      handleValueChange,
    ],
  );

  // Focus management: sync focusedValue state when focus enters the group.
  // An item's own onFocus runs first (target before ancestors) and claims the
  // focused value; the functional update sees that queued value, so this only
  // fills in a default when no item claimed the focus.
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (count > 0) {
        const initialFocus = value || getItemAtIndex(0);
        if (initialFocus) {
          setFocusedValue((previous) => previous ?? initialFocus);
        }
      }
    },
    [onFocus, count, value, getItemAtIndex],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onBlur?.(event);
      const nextFocusedElement = event.relatedTarget as Node | null;
      if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
        setFocusedValue(null);
      }
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
      tabStopValue,
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
      tabStopValue,
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

  // `aria-readonly` is only permitted on the radiogroup (ARIA 1.2 disallows it
  // on `role="radio"`), so it lives here rather than on each item.
  const ariaAttributes = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy ?? fieldCtx?.labelId,
    'aria-describedby': ariaDescribedBy ?? fieldDescribedBy,
    'aria-required': resolvedRequired || undefined,
    'aria-readonly': resolvedReadOnly || undefined,
    'aria-invalid': resolvedInvalid || undefined,
  };

  const groupProps = {
    id: baseId,
    ref,
    role: 'radiogroup',
    ...ariaAttributes,
    ...dataAttributes,
    ...rest,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  // The selected value reaches native form data through the checked item's
  // visually hidden `<input type="radio">` (see RadioItem), which also carries
  // `required` for native validity — no extra hidden input is rendered here.
  return (
    <RadioContext.Provider value={contextValue}>
      <Component {...groupProps}>{children}</Component>
    </RadioContext.Provider>
  );
};

Radio.displayName = 'Radio';
