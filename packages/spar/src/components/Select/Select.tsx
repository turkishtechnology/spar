import { useId, useMemo, useState, useCallback, useRef, type ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import { SelectContext } from './hooks';
import type { SelectProps, SelectContextValue, SelectItemData, SelectFocusStrategy } from './types';

/**
 * Select root component providing context and state management for all select components. Supports controlled and uncontrolled patterns with full keyboard navigation and accessibility.
 */
export const Select = <T extends ElementType = 'div'>({
  id: providedId,
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  required = false,
  name,
  autoFocus = false,
  as,
  children,
  ...props
}: SelectProps<T>) => {
  const Component = as || 'div';
  // State management - controlled/uncontrolled
  const [currentValue, setValueState] = useControlledState(
    controlledValue,
    defaultValue,
    onValueChange,
  );
  const [currentOpen = false, setOpenState] = useControlledState(
    controlledOpen,
    defaultOpen,
    onOpenChange,
  );

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const valueNodeRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<Element | null>(null);

  // IDs
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const valueId = `${baseId}-value`;

  // Item collection
  const { items, registerItem, unregisterItem } = useItemRegistry<SelectItemData>();

  // Focus strategy (consumed by SelectContent to decide initial highlight)
  const [focusStrategy, setFocusStrategy] = useState<SelectFocusStrategy>('none');

  // Value change handler
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (disabled) return;
      setValueState(newValue);
    },
    [disabled, setValueState],
  );

  // Open change handler
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (disabled) return;
      setOpenState(newOpen);

      // Reset focus strategy when closing
      if (!newOpen) {
        setFocusStrategy('none');
      }
    },
    [disabled, setOpenState],
  );

  // Context value
  const contextValue = useMemo<SelectContextValue>(
    () => ({
      // State
      open: currentOpen,
      value: currentValue,
      disabled,
      required,
      autoFocus,

      // Actions
      onValueChange: handleValueChange,
      onOpenChange: handleOpenChange,

      // Refs
      triggerRef,
      contentRef,
      valueNodeRef,
      arrowRef,

      // IDs
      triggerId,
      contentId,
      valueId,

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
      disabled,
      required,
      autoFocus,
      handleValueChange,
      handleOpenChange,
      triggerId,
      contentId,
      valueId,
      registerItem,
      unregisterItem,
      focusStrategy,
      setFocusStrategy,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <Component
        {...props}
        data-disabled={disabled ? '' : undefined}
        data-autofocus={autoFocus ? '' : undefined}
      >
        {children}
      </Component>
      {/* Hidden input for form integration */}
      {name && currentValue !== undefined && (
        <input
          type='hidden'
          name={name}
          value={currentValue}
          required={required}
          disabled={disabled}
        />
      )}
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';
