import { useMemo, useCallback, useId, useRef, ElementType } from 'react';
import type { AccordionItemContextValue, AccordionItemKey, AccordionItemProps } from './types';
import { useAccordionContext, AccordionItemContext } from './hooks';
import { Collapsible } from '../Collapsible';

const MISSING_ITEM_KEY_MESSAGE =
  '[spar] Accordion.Item is missing `itemKey`. The component fell back to a generated unique id; the item cannot be matched against `activeIndex` or `defaultActiveIndex`. Pass an explicit `itemKey` (or the deprecated `value` alias).';

/**
 * Individual accordion item providing context for trigger and content components.
 *
 * Identity is taken from `itemKey` (primary) or the deprecated `value` alias.
 * When neither is supplied, the item falls back to a generated `useId` value
 * so each item still has a distinct identity (the previous empty-string
 * fallback caused every keyless item to share state). A one-shot dev warning
 * surfaces the misuse without crashing in production.
 */
export const AccordionItem = <T extends ElementType = 'div'>({
  itemKey: itemKeyProp,
  value: legacyValue,
  disabled: itemDisabled = false,
  id: providedId,
  as,
  children,
  ref,
  ...props
}: AccordionItemProps<T>) => {
  const Component = as || 'div';
  const accordionContext = useAccordionContext();
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const hasExplicitKey = itemKeyProp !== undefined || legacyValue !== undefined;
  const itemKey: AccordionItemKey = itemKeyProp ?? legacyValue ?? generatedId;

  const warnedRef = useRef(false);
  if (
    !hasExplicitKey &&
    !warnedRef.current &&
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production'
  ) {
    warnedRef.current = true;
    // eslint-disable-next-line no-console
    console.warn(MISSING_ITEM_KEY_MESSAGE);
  }

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
        ref={ref}
        {...props}
      >
        {children}
      </Collapsible>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = 'AccordionItem';
