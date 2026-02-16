import { Collapsible as CollapsibleRoot } from './Collapsible';
import { CollapsibleTrigger } from './CollapsibleTrigger';
import { CollapsibleContent } from './CollapsibleContent';
export { useCollapsibleContext } from './hooks';

const Collapsible = CollapsibleRoot as typeof CollapsibleRoot & {
  Root: typeof CollapsibleRoot;
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
};

Collapsible.Root = CollapsibleRoot;
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

export { Collapsible, CollapsibleRoot, CollapsibleTrigger, CollapsibleContent };

export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleTriggerRenderProps,
  CollapsibleContentProps,
} from './types';
