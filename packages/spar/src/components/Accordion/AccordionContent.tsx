import { ElementType } from 'react';
import type { AccordionContentProps } from './types';
import { CollapsibleContent } from '../Collapsible';
import { useCollapsibleContext } from '../Collapsible/hooks';

/**
 * Accordion content panel that shows/hides based on item state. Provides semantic region with proper labeling for screen readers.
 */
export const AccordionContent = <T extends ElementType = 'div'>({
  forceMount = false,
  as,
  children,
  ...props
}: AccordionContentProps<T>) => {
  const { triggerId } = useCollapsibleContext();
  const Component = as || 'div';

  return (
    <CollapsibleContent
      role='region'
      aria-labelledby={triggerId}
      forceMount={forceMount}
      as={Component}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
};

AccordionContent.displayName = 'AccordionContent';
