import React from 'react';
import type { AccordionContentProps } from './types';
import { useAccordionItemContext } from './AccordionItem';

/**
 * Accordion content panel that shows/hides based on item state. Provides semantic region with proper labeling for screen readers.
 */
export const AccordionContent = ({
  forceMount = false,
  as: Component = 'div',
  children,
  ...props
}: AccordionContentProps) => {
  const { isExpanded, triggerId, contentId } = useAccordionItemContext();

  // Early return if collapsed and not force mounted
  if (!isExpanded && !forceMount) {
    return null;
  }

  return (
    <Component
      {...props}
      id={contentId}
      role='region'
      aria-labelledby={triggerId}
      data-state={isExpanded ? 'open' : 'closed'}
      hidden={!isExpanded && forceMount ? true : undefined}
    >
      {children}
    </Component>
  );
};

AccordionContent.displayName = 'AccordionContent';
