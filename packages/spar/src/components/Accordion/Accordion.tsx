import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ElementType,
} from 'react';
import { useItemRegistry } from '@/hooks';
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
  ...props
}: AccordionProps<T>) => {
  const Component = as || 'div';
  // Initialize state based on type
  const getInitialValue = (): string | string[] => {
    if (controlledValue !== undefined) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return type === 'multiple' ? [] : '';
  };

  const [internalValue, setInternalValue] = useState<string | string[]>(getInitialValue);
  const {
    registerItem,
    unregisterItem,
    getItemIndex,
    getItemAtIndex,
    count: itemCount,
  } = useItemRegistry<void>();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

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

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onValueChange?.(newValue);
    },
    [type, isCollapsible, currentValue, disabled, controlledValue, onValueChange],
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
      itemCount,
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
