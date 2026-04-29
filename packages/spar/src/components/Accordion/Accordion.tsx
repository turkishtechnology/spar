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
 * Coerce any caller-supplied `activeIndex` into the canonical shape this
 * component reasons about — array when `allowMultiple`, scalar otherwise.
 *
 * Mirrors Takeoff Core's behavior: a scalar passed in `allowMultiple` mode
 * is wrapped, and an array passed in single mode collapses to its last
 * element ("only the last value is used"). Callers stay free to pass either
 * shape; the rest of the component never has to second-guess it.
 */
const normalizeActiveIndex = (
  input: AccordionActiveIndex | undefined,
  allowMultiple: boolean,
): AccordionActiveIndex => {
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

  const rawControlled: AccordionActiveIndex | undefined = controlledActiveIndex ?? legacyValue;
  const rawInitial: AccordionActiveIndex =
    defaultActiveIndex ?? legacyDefaultValue ?? (effectiveAllowMultiple ? [] : '');

  const normalizedControlled =
    rawControlled !== undefined
      ? normalizeActiveIndex(rawControlled, effectiveAllowMultiple)
      : undefined;
  const normalizedInitial = normalizeActiveIndex(rawInitial, effectiveAllowMultiple);

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

  const [currentValue = normalizedInitial, setValue] = useControlledState<AccordionActiveIndex>(
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
