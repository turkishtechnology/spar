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
export const Select = <T extends ElementType = 'div'>({
  id: providedId,
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

  // State management - controlled/uncontrolled
  const [currentValue, setValueState] = useControlledState(controlledValue, defaultValue, onChange);
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

  // Value change handler
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (resolvedDisabled || resolvedReadOnly) return;
      setValueState(newValue);
    },
    [resolvedDisabled, resolvedReadOnly, setValueState],
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
      registerItem,
      unregisterItem,
      focusStrategy,
      setFocusStrategy,
    ],
  );

  const dataAttributes = {
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
      {/* Hidden input for form integration */}
      {name && currentValue !== undefined && (
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
