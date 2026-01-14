import { createContext, useContext, useEffect, useMemo, useCallback, useId } from 'react';
import type { AccordionItemProps, AccordionItemContextValue } from './types';
import { useAccordionContext } from './Accordion';
import { Collapsible } from '../Collapsible';

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within an AccordionItem');
  }
  return context;
};

/**
 * Individual accordion item providing context for trigger and content components. Manages item registration and expansion state.
 */
export const AccordionItem = ({
  value,
  disabled: itemDisabled = false,
  as: Component = 'div',
  children,
  ...props
}: AccordionItemProps) => {
  const accordionContext = useAccordionContext();
  const triggerId = useId();
  const contentId = useId();

  // Register/unregister item with accordion
  useEffect(() => {
    accordionContext.registerItem(value);
    return () => accordionContext.unregisterItem(value);
  }, [accordionContext, value]);

  // Determine if this item is expanded
  const isExpanded = useMemo(() => {
    if (accordionContext.type === 'single') {
      return accordionContext.value === value;
    } else {
      const valueArray = Array.isArray(accordionContext.value) ? accordionContext.value : [];
      return valueArray.includes(value);
    }
  }, [accordionContext.type, accordionContext.value, value]);

  // Determine if this item is disabled
  const isItemDisabled = accordionContext.disabled || itemDisabled;

  const handleToggle = useCallback(() => {
    if (!isItemDisabled) {
      accordionContext.onItemToggle(value);
    }
  }, [isItemDisabled, value, accordionContext.onItemToggle]);

  const itemContextValue = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isExpanded,
      disabled: isItemDisabled,
      triggerId,
      contentId,
      onToggle: handleToggle,
    }),
    [value, isExpanded, isItemDisabled, triggerId, contentId, handleToggle],
  );

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <Collapsible
        open={isExpanded}
        onOpenChange={handleToggle}
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
