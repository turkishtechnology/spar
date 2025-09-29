import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { AccordionProps, AccordionContextValue } from './types';

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
};

/**
 * Accordion root component providing context and state management for accordion items. Supports single or multiple panel expansion with full keyboard navigation.
 */
export const Accordion = ({
  type = 'single',
  isCollapsible = false,
  value: controlledValue,
  defaultValue,
  onValueChange,
  isDisabled = false,
  orientation = 'vertical',
  as: Component = 'div',
  children,
  ...props
}: AccordionProps) => {
  // Initialize state based on type
  const getInitialValue = (): string | string[] => {
    if (controlledValue !== undefined) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return type === 'multiple' ? [] : '';
  };

  const [internalValue, setInternalValue] = useState<string | string[]>(getInitialValue);
  const [registeredItems, setRegisteredItems] = useState(() => new Set<string>());
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const registerItem = useCallback((itemValue: string) => {
    setRegisteredItems((prev) => new Set(prev).add(itemValue));
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setRegisteredItems((prev) => new Set(Array.from(prev).filter((item) => item !== itemValue)));
  }, []);

  const getItemIndex = useCallback(
    (itemValue: string): number => {
      return Array.from(registeredItems).indexOf(itemValue);
    },
    [registeredItems],
  );

  const getItemAtIndex = useCallback(
    (index: number): string | undefined => {
      return Array.from(registeredItems)[index];
    },
    [registeredItems],
  );

  const getTotalItems = useCallback((): number => {
    return registeredItems.size;
  }, [registeredItems]);

  const handleItemToggle = useCallback(
    (itemValue: string) => {
      if (isDisabled) return;

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

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    },
    [type, isCollapsible, currentValue, isDisabled, controlledValue, onValueChange],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      type,
      isCollapsible,
      value: currentValue,
      onItemToggle: handleItemToggle,
      isDisabled,
      orientation,
      registeredItems,
      registerItem,
      unregisterItem,
      focusedIndex,
      setFocusedIndex,
      getItemIndex,
      getItemAtIndex,
      getTotalItems,
    }),
    [
      type,
      isCollapsible,
      currentValue,
      handleItemToggle,
      isDisabled,
      orientation,
      registeredItems,
      registerItem,
      unregisterItem,
      focusedIndex,
      setFocusedIndex,
      getItemIndex,
      getItemAtIndex,
      getTotalItems,
    ],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <Component {...props} data-orientation={orientation} data-type={type}>
        {children}
      </Component>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
