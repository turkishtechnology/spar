import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
} from './Tooltip';

// Create aliases for grouped pattern
const Provider = TooltipProvider;
const Root = TooltipRoot;
const Trigger = TooltipTrigger;
const Content = TooltipContent;
const Portal = TooltipPortal;
const Arrow = TooltipArrow;

// Export both patterns
export {
  // Named exports (tree-shakeable)
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,

  // Aliased exports (for grouped usage)
  Provider,
  Root,
  Trigger,
  Content,
  Portal,
  Arrow,
};

// Export types
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  Side,
  Align,
  Sticky,
} from './types';
