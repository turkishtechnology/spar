import { TooltipProvider } from './TooltipProvider';
import { TooltipRoot } from './TooltipRoot';
import { TooltipTrigger } from './TooltipTrigger';
import { TooltipContent } from './TooltipContent';
import { TooltipPortal } from './TooltipPortal';
import { TooltipArrow } from './TooltipArrow';

// Create compound component with dot notation support
const TooltipCompound = TooltipRoot as typeof TooltipRoot & {
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Portal: typeof TooltipPortal;
  Arrow: typeof TooltipArrow;
  Provider: typeof TooltipProvider;
};

TooltipCompound.Root = TooltipRoot;
TooltipCompound.Trigger = TooltipTrigger;
TooltipCompound.Content = TooltipContent;
TooltipCompound.Portal = TooltipPortal;
TooltipCompound.Arrow = TooltipArrow;
TooltipCompound.Provider = TooltipProvider;

// Export both patterns
export {
  // Compound component (with dot notation)
  TooltipCompound as Tooltip,
  // Named exports (tree-shakeable)
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
};

// Export types
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  Sticky,
} from './types';
