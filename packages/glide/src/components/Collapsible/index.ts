import { Collapsible } from './Collapsible';
import { CollapsibleTrigger } from './CollapsibleTrigger';
import { CollapsibleContent } from './CollapsibleContent';

// Create aliases for grouped pattern
const Root = Collapsible;
const Trigger = CollapsibleTrigger;
const Content = CollapsibleContent;

// Export both patterns
export {
  // Named exports (tree-shakeable)
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,

  // Aliased exports (for grouped usage)
  Root,
  Trigger,
  Content,
};

// Export types
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from './types';
