import { TooltipProvider } from './TooltipProvider';
import { Tooltip as TooltipRoot } from './Tooltip';
import { TooltipTrigger } from './TooltipTrigger';
import { TooltipContent } from './TooltipContent';
import { TooltipPortal } from './TooltipPortal';
import { TooltipArrow } from './TooltipArrow';
export { useTooltipContext } from './hooks';

const Tooltip = TooltipRoot as typeof TooltipRoot & {
  Root: typeof TooltipRoot;
  Provider: typeof TooltipProvider;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Portal: typeof TooltipPortal;
  Arrow: typeof TooltipArrow;
};

Tooltip.Root = TooltipRoot;
Tooltip.Provider = TooltipProvider;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Portal = TooltipPortal;
Tooltip.Arrow = TooltipArrow;

export {
  Tooltip,
  TooltipRoot,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
};

export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipTriggerRenderProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  Sticky,
  TooltipContextValue,
} from './types';
