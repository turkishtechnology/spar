import { Accordion as AccordionRoot } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';

// Create compound component with dot notation support
const Accordion = AccordionRoot as typeof AccordionRoot & {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

Accordion.Root = AccordionRoot;
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

// Export both patterns
export {
  // Compound component (with dot notation)
  Accordion,

  // Named exports (tree-shakeable)
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,

  // Root alias for explicit usage
  AccordionRoot,
};

// Export types
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionTriggerRenderProps,
  AccordionContentProps,
  AccordionType,
} from './types';
