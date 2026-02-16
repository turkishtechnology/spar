import { Tabs as TabsRoot } from './Tabs';
import { TabsList } from './TabsList';
import { TabsTrigger } from './TabsTrigger';
import { TabsContent } from './TabsContent';
export { useTabsContext } from './hooks';

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

export { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent };

export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsTriggerRenderProps,
  TabsContentProps,
  TabsActivationMode,
} from './types';
