import { useMemo, useState, useCallback, ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import type {
  AccordionActiveIndex,
  AccordionContextValue,
  AccordionItemKey,
  AccordionProps,
} from './types';
import { AccordionContext } from './hooks';

/**
 * Accordion root component providing context and state management for accordion items.
 * Supports single or multiple panel expansion with full keyboard navigation.
 *
 * Primary API uses Takeoff vocabulary (`allowMultiple`, `activeIndex`,
 * `defaultActiveIndex`, `onActiveIndexChange`, `preventCollapse`). The legacy
 * `type`/`value`/`defaultValue`/`onValueChange`/`isCollapsible` props are kept
 * as deprecated aliases for one major release and will be removed.
 */
export const Accordion = <T extends ElementType = 'div'>({
  allowMultiple,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex,
  onActiveIndexChange,
  preventCollapse,
  // Deprecated aliases — kept for one major release.
  type,
  value: legacyValue,
  defaultValue: legacyDefaultValue,
  onValueChange: legacyOnValueChange,
  isCollapsible: legacyIsCollapsible,
  disabled = false,
  orientation = 'vertical',
  as,
  children,
  ref,
  ...props
}: AccordionProps<T>) => {
  const Component = as || 'div';

  const effectiveAllowMultiple = allowMultiple ?? type === 'multiple';
  const effectivePreventCollapse =
    preventCollapse ?? (legacyIsCollapsible !== undefined ? !legacyIsCollapsible : false);

  const controlledValue: AccordionActiveIndex | undefined = controlledActiveIndex ?? legacyValue;
  const initialValue: AccordionActiveIndex =
    defaultActiveIndex ?? legacyDefaultValue ?? (effectiveAllowMultiple ? [] : '');

  const handleChange = useCallback(
    (next: AccordionActiveIndex) => {
      onActiveIndexChange?.(next);
      if (legacyOnValueChange) {
        const stringified: string | string[] = Array.isArray(next)
          ? next.map(String)
          : next === ''
            ? ''
            : String(next);
        legacyOnValueChange(stringified);
      }
    },
    [onActiveIndexChange, legacyOnValueChange],
  );

  const [currentValue = initialValue, setValue] = useControlledState<AccordionActiveIndex>(
    controlledValue,
    initialValue,
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
    (itemKey: AccordionItemKey) => {
      if (disabled) return;

      let nextValue: AccordionActiveIndex;

      if (!effectiveAllowMultiple) {
        const isExpanded = currentValue === itemKey;
        if (isExpanded && effectivePreventCollapse) {
          return;
        }
        nextValue = isExpanded ? '' : itemKey;
      } else {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const isExpanded = currentArray.includes(itemKey);
        nextValue = isExpanded
          ? currentArray.filter((v) => v !== itemKey)
          : [...currentArray, itemKey];
      }

      setValue(nextValue);
    },
    [effectiveAllowMultiple, effectivePreventCollapse, currentValue, disabled, setValue],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      allowMultiple: effectiveAllowMultiple,
      preventCollapse: effectivePreventCollapse,
      activeIndex: currentValue,
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
