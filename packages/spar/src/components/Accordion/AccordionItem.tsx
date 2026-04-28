import { useMemo, useCallback, useId, ElementType } from 'react';
import type { AccordionItemContextValue, AccordionItemKey, AccordionItemProps } from './types';
import { useAccordionContext, AccordionItemContext } from './hooks';
import { Collapsible } from '../Collapsible';

/**
 * Individual accordion item providing context for trigger and content components.
 *
 * Identity is taken from `itemKey` (primary) or the deprecated `value` alias.
 * Items declared without either receive an empty-string identity, which is
 * almost certainly a developer error and will not match any `activeIndex`.
 */
export const AccordionItem = <T extends ElementType = 'div'>({
  itemKey: itemKeyProp,
  value: legacyValue,
  disabled: itemDisabled = false,
  id: providedId,
  as,
  children,
  ...props
}: AccordionItemProps<T>) => {
  const Component = as || 'div';
  const accordionContext = useAccordionContext();
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const itemKey: AccordionItemKey = itemKeyProp ?? legacyValue ?? '';

  const isOpen = useMemo(() => {
    if (!accordionContext.allowMultiple) {
      return accordionContext.activeIndex === itemKey;
    }
    const valueArray = Array.isArray(accordionContext.activeIndex)
      ? accordionContext.activeIndex
      : [];
    return valueArray.includes(itemKey);
  }, [accordionContext.allowMultiple, accordionContext.activeIndex, itemKey]);

  const isItemDisabled = accordionContext.disabled || itemDisabled;

  const toggle = useCallback(() => {
    if (!isItemDisabled) {
      accordionContext.onItemToggle(itemKey);
    }
  }, [isItemDisabled, itemKey, accordionContext.onItemToggle]);

  const open = useCallback(() => {
    if (!isItemDisabled && !isOpen) {
      accordionContext.onItemToggle(itemKey);
    }
  }, [isItemDisabled, isOpen, itemKey, accordionContext.onItemToggle]);

  const close = useCallback(() => {
    if (!isItemDisabled && isOpen) {
      accordionContext.onItemToggle(itemKey);
    }
  }, [isItemDisabled, isOpen, itemKey, accordionContext.onItemToggle]);

  const itemContextValue = useMemo<AccordionItemContextValue>(
    () => ({
      itemKey,
      isOpen,
      disabled: isItemDisabled,
      triggerId,
      contentId,
      open,
      close,
      toggle,
    }),
    [itemKey, isOpen, isItemDisabled, triggerId, contentId, open, close, toggle],
  );

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <Collapsible
        open={isOpen}
        onOpenChange={toggle}
        disabled={isItemDisabled}
        triggerId={triggerId}
        contentId={contentId}
        as={Component}
        {...props}
      >
        {children}
      </Collapsible>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = 'AccordionItem';
