import { useMemo, useState, useCallback, ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import type { AccordionProps, AccordionContextValue } from './types';
import { AccordionContext } from './hooks';

/**
 * Accordion root component providing context and state management for accordion items. Supports single or multiple panel expansion with full keyboard navigation.
 */
export const Accordion = <T extends ElementType = 'div'>({
  selectionMode = 'single',
  isCollapsible = false,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  orientation = 'vertical',
  as,
  children,
  ref,
  ...props
}: AccordionProps<T>) => {
  const Component = as || 'div';
  // State management - controlled/uncontrolled
  const defaultVal =
    defaultValue !== undefined ? defaultValue : selectionMode === 'multiple' ? [] : '';
  const [currentValue = defaultVal, setValue] = useControlledState<string | string[]>(
    controlledValue,
    defaultVal,
    onValueChange,
  );
  const {
    items: accordionItems,
    registerItem,
    unregisterItem,
    getItemIndex,
    getItemAtIndex,
    count: itemCount,
  } = useItemRegistry<HTMLElement>();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const focusItemAtIndex = useCallback(
    (index: number): void => {
      const key = getItemAtIndex(index);
      if (key !== undefined) {
        accordionItems.get(key)?.focus();
      }
    },
    [accordionItems, getItemAtIndex],
  );

  const handleItemToggle = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      let newValue: string | string[];

      if (selectionMode === 'single') {
        const isExpanded = currentValue === itemValue;
        // For single mode, only allow collapse if collapsible is true
        if (isExpanded && !isCollapsible) {
          return; // Don't allow collapsing if not collapsible
        }
        newValue = isExpanded ? '' : itemValue;
      } else {
        // Multiple mode
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const isExpanded = currentArray.includes(itemValue);
        newValue = isExpanded
          ? currentArray.filter((v) => v !== itemValue)
          : [...currentArray, itemValue];
      }

      setValue(newValue);
    },
    [selectionMode, isCollapsible, currentValue, disabled, setValue],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      selectionMode,
      isCollapsible,
      value: currentValue,
      onItemToggle: handleItemToggle,
      disabled,
      orientation,
      registerItem,
      unregisterItem,
      focusedIndex,
      setFocusedIndex,
      getItemIndex,
      getItemAtIndex,
      focusItemAtIndex,
      itemCount,
    }),
    [
      selectionMode,
      isCollapsible,
      currentValue,
      handleItemToggle,
      disabled,
      orientation,
      registerItem,
      unregisterItem,
      focusedIndex,
      setFocusedIndex,
      getItemIndex,
      getItemAtIndex,
      focusItemAtIndex,
      itemCount,
    ],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <Component
        ref={ref}
        {...props}
        data-orientation={orientation}
        data-selection-mode={selectionMode}
      >
        {children}
      </Component>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
