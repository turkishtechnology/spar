import { useId, useMemo, useState, useCallback, useRef, type ElementType } from 'react';
import { useItemRegistry } from '@/hooks';
import { SelectContext } from './hooks';
import type { SelectProps, SelectContextValue, SelectItemData } from './types';

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
  dir = 'ltr',
  autoFocus = false,
  as,
  children,
  ...props
}: SelectProps<T>) => {
  const Component = as || 'div';
  // State management for value
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const currentValue = isValueControlled ? controlledValue : internalValue;

  // State management for open
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const currentOpen = isOpenControlled ? controlledOpen : internalOpen;

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

  // Focus and type-ahead state
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchString, setSearchString] = useState('');

  // Value change handler
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (disabled) return;

      if (!isValueControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [disabled, isValueControlled, onValueChange],
  );

  // Open change handler
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (disabled) return;

      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);

      // Reset highlighted index when closing
      if (!newOpen) {
        setHighlightedIndex(-1);
        setSearchString('');
      }
    },
    [disabled, isOpenControlled, onOpenChange],
  );

  // Context value
  const contextValue = useMemo<SelectContextValue>(
    () => ({
      // State
      open: currentOpen,
      value: currentValue,
      disabled,
      required,
      dir,
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

      // Focus management
      highlightedIndex,
      setHighlightedIndex,

      // Type-ahead
      searchString,
      setSearchString,
    }),
    [
      currentOpen,
      currentValue,
      disabled,
      required,
      dir,
      autoFocus,
      handleValueChange,
      handleOpenChange,
      triggerId,
      contentId,
      valueId,
      registerItem,
      unregisterItem,
      highlightedIndex,
      searchString,
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
