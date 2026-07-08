import { useId, useMemo, useState, useCallback, useRef, type ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import { SelectContext } from './hooks';
import { useOptionalFieldContext } from '../Field/hooks';
import type { SelectProps, SelectContextValue, SelectItemData, SelectFocusStrategy } from './types';

/**
 * Select root component providing context and state management for all select
 * components. Supports controlled and uncontrolled patterns with full keyboard
 * navigation and accessibility.
 *
 * When nested inside a `<Field>`, it reads the Field's `invalid`, `disabled`,
 * `required` and `readOnly` values automatically, and inherits the coordinated
 * ARIA IDs so FieldLabel / FieldDescription / FieldErrorMessage wire to the
 * SelectTrigger without extra plumbing. Direct props on `<Select>` override
 * the inherited values.
 */
/**
 * Coerce a value into the shape the current mode expects: always an array in
 * multiple mode (empty when unset), a scalar in single mode (an array picks
 * its last entry, mirroring "last selection wins").
 */
const normalizeValue = (
  input: string | string[] | undefined,
  multiple: boolean,
): string | string[] | undefined => {
  if (multiple) {
    if (input === undefined) return [];
    return Array.isArray(input) ? input : [input];
  }
  if (input === undefined || !Array.isArray(input)) return input;
  // Non-empty guaranteed by the length check, so the index access is safe.
  return input.length === 0 ? undefined : input[input.length - 1]!;
};

export const Select = <T extends ElementType = 'div'>({
  id: providedId,
  multiple = false,
  closeOnSelect,
  value: controlledValue,
  defaultValue,
  onChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  invalid,
  disabled,
  required,
  readOnly,
  name,
  autoFocus = false,
  as,
  children,
  ...props
}: SelectProps<T>) => {
  const Component = as || 'div';
  const fieldCtx = useOptionalFieldContext();

  // Direct props win; otherwise fall back to Field context; then default false.
  const resolvedInvalid = invalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  // State management - controlled/uncontrolled. Values are normalized per mode
  // so multiple mode always works against an array. Memoized so a stable scalar
  // in multiple mode does not yield a fresh array on every render — which would
  // change the context value and needlessly re-render every consumer.
  const normalizedControlledValue = useMemo(
    () => (controlledValue !== undefined ? normalizeValue(controlledValue, multiple) : undefined),
    [controlledValue, multiple],
  );
  const normalizedDefaultValue = useMemo(
    () => normalizeValue(defaultValue, multiple),
    [defaultValue, multiple],
  );
  const [currentValue, setValueState] = useControlledState<string | string[]>(
    normalizedControlledValue,
    normalizedDefaultValue,
    onChange,
  );
  const resolvedCloseOnSelect = closeOnSelect ?? !multiple;
  const [currentOpen = false, setOpenState] = useControlledState(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<Element | null>(null);

  // IDs - reuse Field's coordinated IDs when nested so FieldLabel's htmlFor
  // lands on the trigger button and aria-describedby resolves correctly.
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = fieldCtx?.fieldId ?? `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const labelId = fieldCtx?.labelId ?? `${baseId}-label`;
  const descriptionId = fieldCtx?.descriptionId ?? `${baseId}-description`;
  const errorId = fieldCtx?.errorId ?? `${baseId}-error`;

  // Item collection
  const { items, registerItem, unregisterItem } = useItemRegistry<SelectItemData>();

  // Focus strategy (consumed by SelectContent to decide initial highlight)
  const [focusStrategy, setFocusStrategy] = useState<SelectFocusStrategy>('none');

  // Value change handler. Item-scoped: receives the interacted item's value;
  // single mode replaces the selection, multiple mode toggles membership.
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (resolvedDisabled || resolvedReadOnly) return;
      if (multiple) {
        const current = Array.isArray(currentValue) ? currentValue : [];
        setValueState(
          current.includes(newValue)
            ? current.filter((entry) => entry !== newValue)
            : [...current, newValue],
        );
        return;
      }
      // Re-selecting the current value is a no-op; skip so onChange doesn't fire
      // for an unchanged selection.
      if (currentValue === newValue) return;
      setValueState(newValue);
    },
    [resolvedDisabled, resolvedReadOnly, multiple, currentValue, setValueState],
  );

  // Open change handler
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (resolvedDisabled) return;
      setOpenState(newOpen);

      // Reset focus strategy when closing
      if (!newOpen) {
        setFocusStrategy('none');
      }
    },
    [resolvedDisabled, setOpenState],
  );

  // Context value
  const contextValue = useMemo<SelectContextValue>(
    () => ({
      // State
      open: currentOpen,
      value: currentValue,
      multiple,
      closeOnSelect: resolvedCloseOnSelect,
      invalid: resolvedInvalid,
      disabled: resolvedDisabled,
      required: resolvedRequired,
      readOnly: resolvedReadOnly,
      autoFocus,

      // Actions
      onChange: handleValueChange,
      onOpenChange: handleOpenChange,

      // Refs
      triggerRef,
      contentRef,
      arrowRef,

      // IDs
      triggerId,
      contentId,
      labelId,
      descriptionId,
      errorId,
      hasField: fieldCtx !== null,

      // Collections
      items,
      registerItem,
      unregisterItem,

      // Focus strategy
      focusStrategy,
      setFocusStrategy,
    }),
    [
      currentOpen,
      currentValue,
      multiple,
      resolvedCloseOnSelect,
      resolvedInvalid,
      resolvedDisabled,
      resolvedRequired,
      resolvedReadOnly,
      autoFocus,
      handleValueChange,
      handleOpenChange,
      triggerId,
      contentId,
      labelId,
      descriptionId,
      errorId,
      fieldCtx,
      items,
      registerItem,
      unregisterItem,
      focusStrategy,
      setFocusStrategy,
    ],
  );

  const dataAttributes = {
    'data-multiple': multiple ? '' : undefined,
    'data-invalid': resolvedInvalid ? '' : undefined,
    'data-disabled': resolvedDisabled ? '' : undefined,
    'data-required': resolvedRequired ? '' : undefined,
    'data-readonly': resolvedReadOnly ? '' : undefined,
    'data-autofocus': autoFocus ? '' : undefined,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <Component {...props} {...dataAttributes}>
        {children}
      </Component>
      {/* Hidden inputs for form integration: one per selected value in
          multiple mode. Note `required` is not emitted here — the attribute
          has no effect on type=hidden inputs, so required enforcement stays
          with form-level validation. */}
      {name &&
        multiple &&
        Array.isArray(currentValue) &&
        currentValue.map((entry) => (
          <input key={entry} type='hidden' name={name} value={entry} disabled={resolvedDisabled} />
        ))}
      {name && !multiple && typeof currentValue === 'string' && (
        <input
          type='hidden'
          name={name}
          value={currentValue}
          required={resolvedRequired}
          disabled={resolvedDisabled}
        />
      )}
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';
