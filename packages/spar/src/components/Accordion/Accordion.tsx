import { useMemo, useState, useCallback, ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import type {
  AccordionContextValue,
  AccordionCurrentValue,
  AccordionProps,
  AccordionValue,
} from './types';
import { AccordionContext } from './hooks';

const normalizeValue = (
  input: AccordionCurrentValue | undefined,
  allowMultiple: boolean,
): AccordionCurrentValue => {
  if (allowMultiple) {
    if (input === undefined) return [];
    return Array.isArray(input) ? input : [input];
  }
  if (input === undefined) return '';
  if (Array.isArray(input)) {
    return input.length === 0 ? '' : input[input.length - 1]!;
  }
  return input;
};

/**
 * Accordion root component providing context and state management for accordion items.
 * Supports single or multiple panel expansion with full keyboard navigation.
 */
export const Accordion = <T extends ElementType = 'div'>({
  allowMultiple,
  value: controlledValue,
  defaultValue,
  onValueChange,
  preventCollapse,
  disabled = false,
  orientation = 'vertical',
  as,
  children,
  ref,
  ...props
}: AccordionProps<T>) => {
  const Component = as || 'div';

  const effectiveAllowMultiple = allowMultiple ?? false;
  const effectivePreventCollapse = preventCollapse ?? false;

  const normalizedControlled =
    controlledValue !== undefined
      ? normalizeValue(controlledValue, effectiveAllowMultiple)
      : undefined;
  const normalizedInitial = normalizeValue(defaultValue, effectiveAllowMultiple);

  const handleChange = useCallback(
    (next: AccordionCurrentValue) => {
      onValueChange?.(next);
    },
    [onValueChange],
  );

  const [currentValue = normalizedInitial, setValue] = useControlledState<AccordionCurrentValue>(
    normalizedControlled,
    normalizedInitial,
    handleChange,
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
    (itemValue: AccordionValue) => {
      if (disabled) return;

      let nextValue: AccordionCurrentValue;

      if (!effectiveAllowMultiple) {
        const isExpanded = currentValue === itemValue;
        if (isExpanded && effectivePreventCollapse) {
          return;
        }
        nextValue = isExpanded ? '' : itemValue;
      } else {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const isExpanded = currentArray.includes(itemValue);
        nextValue = isExpanded
          ? currentArray.filter((value) => value !== itemValue)
          : [...currentArray, itemValue];
      }

      setValue(nextValue);
    },
    [effectiveAllowMultiple, effectivePreventCollapse, currentValue, disabled, setValue],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      allowMultiple: effectiveAllowMultiple,
      preventCollapse: effectivePreventCollapse,
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
      effectiveAllowMultiple,
      effectivePreventCollapse,
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
        data-type={effectiveAllowMultiple ? 'multiple' : 'single'}
      >
        {children}
      </Component>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
