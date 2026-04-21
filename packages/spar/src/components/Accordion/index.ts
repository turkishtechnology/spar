import { Accordion as AccordionRoot } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';
export { useAccordionContext, useAccordionItemContext } from './hooks';

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

export {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
};

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionTriggerRenderProps,
  AccordionContentProps,
  AccordionSelectionMode,
} from './types';
