import { createContext, useContext, useId, useMemo, useState, useCallback, useRef } from 'react';
import { useItemRegistry } from '@/hooks';
import type { SelectRootProps, SelectContextValue, SelectItemData } from './types';

const SelectContext = createContext<SelectContextValue | null>(null);

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select.Root');
  }
  return context;
};

/**
 * Select root component providing context and state management for all select components. Supports controlled and uncontrolled patterns with full keyboard navigation and accessibility.
 */
export const SelectRoot = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  isDisabled = false,
  required = false,
  name,
  dir = 'ltr',
  as: Component = 'div',
  children,
  ...props
}: SelectRootProps) => {
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

  // IDs
  const triggerId = useId();
  const contentId = useId();
  const valueId = useId();

  // Item collection
  const { items, registerItem, unregisterItem } = useItemRegistry<SelectItemData>();

  // Focus and type-ahead state
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchString, setSearchString] = useState('');

  // Value change handler
  const handleValueChange = useCallback(
    (newValue: string) => {
      if (isDisabled) return;

      if (!isValueControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isDisabled, isValueControlled, onValueChange],
  );

  // Open change handler
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (isDisabled) return;

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
    [isDisabled, isOpenControlled, onOpenChange],
  );

  // Context value
  const contextValue = useMemo<SelectContextValue>(
    () => ({
      // State
      open: currentOpen,
      value: currentValue,
      disabled: isDisabled,
      required,
      dir,

      // Actions
      onValueChange: handleValueChange,
      onOpenChange: handleOpenChange,

      // Refs
      triggerRef,
      contentRef,
      valueNodeRef,

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
      isDisabled,
      required,
      dir,
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
      <Component {...props} data-disabled={isDisabled ? '' : undefined}>
        {children}
      </Component>
      {/* Hidden input for form integration */}
      {name && currentValue !== undefined && (
        <input
          type='hidden'
          name={name}
          value={currentValue}
          required={required}
          disabled={isDisabled}
        />
      )}
    </SelectContext.Provider>
  );
};

SelectRoot.displayName = 'SelectRoot';
