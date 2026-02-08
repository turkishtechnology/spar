import { createContext, useContext } from 'react';
import type { AccordionItemContextValue } from '../types';

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem components must be used within an AccordionItem');
  }
  return context;
};
