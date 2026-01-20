import React from 'react';
import type { AccordionHeaderProps } from './types';
import { useAccordionItemContext } from './AccordionItem';

/**
 * Accordion header providing semantic heading structure for triggers. Wraps the trigger in appropriate heading element for document hierarchy.
 */
export const AccordionHeader = ({ level = 3, as, children, ...props }: AccordionHeaderProps) => {
  const { isOpen, disabled } = useAccordionItemContext();

  // Determine the component to render
  const Component = as || (`h${level}` as React.ElementType);

  return (
    <Component
      {...props}
      data-state={isOpen ? 'open' : 'closed'}
      data-level={level}
      {...(disabled && { 'data-disabled': '' })}
    >
      {children}
    </Component>
  );
};

AccordionHeader.displayName = 'AccordionHeader';
