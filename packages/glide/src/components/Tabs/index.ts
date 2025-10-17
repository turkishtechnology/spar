import { Tabs as TabsRoot } from './Tabs';
import { TabsList } from './TabsList';
import { TabsTrigger } from './TabsTrigger';
import { TabsContent } from './TabsContent';

// Create compound component with dot notation support
const Tabs = TabsRoot as typeof TabsRoot & {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

Tabs.Root = TabsRoot;
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

// Export both patterns
export {
  // Compound component (with dot notation)
  Tabs,

  // Named exports (tree-shakeable)
  TabsList,
  TabsTrigger,
  TabsContent,

  // Root alias for explicit usage
  TabsRoot,
};

// Export types
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsActivationMode,
} from './types';
