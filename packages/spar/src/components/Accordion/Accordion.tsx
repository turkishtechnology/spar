import { useMemo, useCallback, ElementType } from 'react';
import { useItemRegistry, useControlledState } from '@/hooks';
import type {
  AccordionContextValue,
  AccordionCurrentValue,
  AccordionFocusTarget,
  AccordionProps,
  AccordionValue,
} from './types';
import { AccordionContext } from './hooks';

const normalizeValue = (
  input: AccordionCurrentValue | undefined,
  multiple: boolean,
): AccordionCurrentValue => {
  if (multiple) {
    if (input === undefined) return [];
    return Array.isArray(input) ? input : [input];
  }
  if (input === undefined) return '';
  if (Array.isArray(input)) {
    return input.length === 0 ? '' : input[input.length - 1]!;
  }
  return input;
};

// Read the live DOM so a trigger disabled after it registered (item or root
// `disabled`) is still skipped. Covers native buttons and `as` elements.
const isDisabledTrigger = (element: HTMLElement): boolean =>
  element.hasAttribute('disabled') ||
  element.getAttribute('aria-disabled') === 'true' ||
  element.hasAttribute('data-disabled');

/**
 * Accordion root component providing context and state management for accordion items.
 * Supports single or multiple panel expansion with full keyboard navigation.
 */
export const Accordion = <T extends ElementType = 'div'>({
  multiple,
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible,
  disabled = false,
  orientation = 'vertical',
  as,
  children,
  ref,
  ...props
}: AccordionProps<T>) => {
  const Component = as || 'div';

  const effectiveMultiple = multiple ?? false;
  const effectiveCollapsible = collapsible ?? true;

  const normalizedControlled =
    controlledValue !== undefined ? normalizeValue(controlledValue, effectiveMultiple) : undefined;
  const normalizedInitial = normalizeValue(defaultValue, effectiveMultiple);

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
    getItemIds,
  } = useItemRegistry<HTMLElement>();

  // Keyboard navigation follows DOM order (the registry sorts by document
  // position), skips disabled triggers and wraps around at both ends.
  const focusItem = useCallback(
    (itemId: string, target: AccordionFocusTarget): void => {
      const itemIds = getItemIds();
      const isEnabled = (id: string): boolean => {
        const element = accordionItems.get(id);
        return element !== undefined && !isDisabledTrigger(element);
      };

      let nextId: string | undefined;

      if (target === 'first' || target === 'last') {
        const enabledIds = itemIds.filter(isEnabled);
        nextId = target === 'first' ? enabledIds[0] : enabledIds[enabledIds.length - 1];
      } else {
        const step = target === 'next' ? 1 : -1;
        let index = itemIds.indexOf(itemId);
        for (let i = 0; i < itemIds.length && nextId === undefined; i += 1) {
          index = (index + step + itemIds.length) % itemIds.length;
          const candidate = itemIds[index];
          if (candidate !== undefined && isEnabled(candidate)) nextId = candidate;
        }
      }

      if (nextId !== undefined) {
        accordionItems.get(nextId)?.focus();
      }
    },
    [accordionItems, getItemIds],
  );

  const handleItemToggle = useCallback(
    (itemValue: AccordionValue) => {
      if (disabled) return;

      let nextValue: AccordionCurrentValue;

      if (!effectiveMultiple) {
        const isExpanded = currentValue === itemValue;
        if (isExpanded && !effectiveCollapsible) {
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
    [effectiveMultiple, effectiveCollapsible, currentValue, disabled, setValue],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      multiple: effectiveMultiple,
      collapsible: effectiveCollapsible,
      value: currentValue,
      onItemToggle: handleItemToggle,
      disabled,
      orientation,
      registerItem,
      unregisterItem,
      focusItem,
    }),
    [
      effectiveMultiple,
      effectiveCollapsible,
      currentValue,
      handleItemToggle,
      disabled,
      orientation,
      registerItem,
      unregisterItem,
      focusItem,
    ],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <Component
        ref={ref}
        {...props}
        data-orientation={orientation}
        data-type={effectiveMultiple ? 'multiple' : 'single'}
      >
        {children}
      </Component>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';
