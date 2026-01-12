import type { AccordionContentProps } from './types';
import { CollapsibleContent } from '../Collapsible';
import { useCollapsibleContext } from '../Collapsible/Collapsible';

/**
 * Accordion content panel that shows/hides based on item state. Provides semantic region with proper labeling for screen readers.
 */
export const AccordionContent = ({
  forceMount = false,
  as = 'div',
  children,
  ...props
}: AccordionContentProps) => {
  const { triggerId } = useCollapsibleContext();

  return (
    <CollapsibleContent
      role='region'
      aria-labelledby={triggerId}
      forceMount={forceMount}
      as={as}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
};

AccordionContent.displayName = 'AccordionContent';
