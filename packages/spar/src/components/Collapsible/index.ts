import { Collapsible as CollapsibleRoot } from './Collapsible';
import { CollapsibleTrigger } from './CollapsibleTrigger';
import { CollapsibleContent } from './CollapsibleContent';

// Create compound component with dot notation support
const Collapsible = CollapsibleRoot as typeof CollapsibleRoot & {
  Root: typeof CollapsibleRoot;
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
};

Collapsible.Root = CollapsibleRoot;
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

// Export both patterns
export {
  // Compound component (with dot notation)
  Collapsible,

  // Named exports (tree-shakeable)
  CollapsibleTrigger,
  CollapsibleContent,

  // Root alias for explicit usage
  CollapsibleRoot,
};

// Export types
export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleTriggerRenderProps,
  CollapsibleContentProps,
} from './types';
