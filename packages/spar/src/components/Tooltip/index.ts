import { TooltipProvider } from './TooltipProvider';
import { Tooltip as TooltipRoot } from './Tooltip';
import { TooltipTrigger } from './TooltipTrigger';
import { TooltipContent } from './TooltipContent';
import { TooltipArrow } from './TooltipArrow';
export { useTooltipContext } from './hooks';

const Tooltip = TooltipRoot as typeof TooltipRoot & {
  Root: typeof TooltipRoot;
  Provider: typeof TooltipProvider;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow: typeof TooltipArrow;
};

Tooltip.Root = TooltipRoot;
Tooltip.Provider = TooltipProvider;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
Tooltip.Arrow = TooltipArrow;

export { Tooltip, TooltipRoot, TooltipProvider, TooltipTrigger, TooltipContent, TooltipArrow };

export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipTriggerRenderProps,
  TooltipContentProps,
  TooltipArrowProps,
  Sticky,
  TooltipContextValue,
} from './types';
