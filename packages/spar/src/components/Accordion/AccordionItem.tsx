import { useMemo, useCallback, useId, ElementType } from 'react';
import type { AccordionItemProps, AccordionItemContextValue } from './types';
import { useAccordionContext, AccordionItemContext } from './hooks';
import { Collapsible } from '../Collapsible';

/**
 * Individual accordion item providing context for trigger and content components. Manages item registration and expansion state.
 */
export const AccordionItem = <T extends ElementType = 'div'>({
  value,
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

  // Determine if this item is expanded
  const isOpen = useMemo(() => {
    if (accordionContext.type === 'single') {
      return accordionContext.value === value;
    } else {
      const valueArray = Array.isArray(accordionContext.value) ? accordionContext.value : [];
      return valueArray.includes(value);
    }
  }, [accordionContext.type, accordionContext.value, value]);

  // Determine if this item is disabled
  const isItemDisabled = accordionContext.disabled || itemDisabled;

  const toggle = useCallback(() => {
    if (!isItemDisabled) {
      accordionContext.onItemToggle(value);
    }
  }, [isItemDisabled, value, accordionContext.onItemToggle]);

  const open = useCallback(() => {
    if (!isItemDisabled && !isOpen) {
      accordionContext.onItemToggle(value);
    }
  }, [isItemDisabled, isOpen, value, accordionContext.onItemToggle]);

  const close = useCallback(() => {
    if (!isItemDisabled && isOpen) {
      accordionContext.onItemToggle(value);
    }
  }, [isItemDisabled, isOpen, value, accordionContext.onItemToggle]);

  const itemContextValue = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isOpen,
      disabled: isItemDisabled,
      triggerId,
      contentId,
      open,
      close,
      toggle,
    }),
    [value, isOpen, isItemDisabled, triggerId, contentId, open, close, toggle],
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
