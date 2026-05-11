import { useMemo, useCallback, useId, ElementType } from 'react';
import type { AccordionItemContextValue, AccordionItemProps } from './types';
import { useAccordionContext, AccordionItemContext } from './hooks';
import { Collapsible } from '../Collapsible';

/**
 * Individual accordion item providing context for trigger and content components.
 */
export const AccordionItem = <T extends ElementType = 'div'>({
  value,
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

  const isOpen = useMemo(() => {
    if (!accordionContext.allowMultiple) {
      return accordionContext.value === value;
    }
    const valueArray = Array.isArray(accordionContext.value) ? accordionContext.value : [];
    return valueArray.includes(value);
  }, [accordionContext.allowMultiple, accordionContext.value, value]);

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
        ref={ref}
        {...props}
        data-open={isOpen ? '' : undefined}
        data-closed={isOpen ? undefined : ''}
      >
        {children}
      </Collapsible>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = 'AccordionItem';
