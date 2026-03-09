import { useMemo, useState, useCallback, ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import type { AccordionProps, AccordionContextValue } from './types';
import { AccordionContext } from './hooks';

/**
 * Accordion root component providing context and state management for accordion items. Supports single or multiple panel expansion with full keyboard navigation.
 */
export const Accordion = <T extends ElementType = 'div'>({
  type = 'single',
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
  const defaultVal = defaultValue !== undefined ? defaultValue : type === 'multiple' ? [] : '';
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

      if (type === 'single') {
        const isExpanded = currentValue === itemValue;
        // For single type, only allow collapse if collapsible is true
        if (isExpanded && !isCollapsible) {
          return; // Don't allow collapsing if not collapsible
        }
        newValue = isExpanded ? '' : itemValue;
      } else {
        // Multiple type
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const isExpanded = currentArray.includes(itemValue);
        newValue = isExpanded
          ? currentArray.filter((v) => v !== itemValue)
          : [...currentArray, itemValue];
      }

      setValue(newValue);
    },
    [type, isCollapsible, currentValue, disabled, setValue],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      type,
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
      type,
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
      <Component ref={ref} {...props} data-orientation={orientation} data-type={type}>
        {children}
      </Component>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
