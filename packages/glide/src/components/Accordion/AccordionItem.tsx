import React, { createContext, useContext, useId, useEffect, useMemo, useCallback } from 'react';
import type { AccordionItemProps, AccordionItemContextValue } from './types';
import { useAccordionContext } from './Accordion';

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
  isDisabled: itemIsDisabled = false,
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
  const isDisabled = accordionContext.isDisabled || itemIsDisabled;

  const handleToggle = useCallback(() => {
    if (!isDisabled) {
      accordionContext.onItemToggle(value);
    }
  }, [isDisabled, value]);

  const itemContextValue = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isExpanded,
      isDisabled,
      triggerId,
      contentId,
      onToggle: handleToggle,
    }),
    [value, isExpanded, isDisabled, triggerId, contentId, handleToggle],
  );

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <Component
        {...props}
        data-state={isExpanded ? 'open' : 'closed'}
        {...(isDisabled && { 'data-disabled': '' })}
      >
        {children}
      </Component>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = 'AccordionItem';
