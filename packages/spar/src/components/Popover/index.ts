import { Popover as PopoverRoot } from './Popover';
import { PopoverTrigger } from './PopoverTrigger';
import { PopoverContent } from './PopoverContent';
import { PopoverArrow } from './PopoverArrow';
import { PopoverAnchor } from './PopoverAnchor';
import { PopoverPortal } from './PopoverPortal';
import { PopoverClose } from './PopoverClose';
export { usePopoverContext } from './hooks';

const Popover = PopoverRoot as typeof PopoverRoot & {
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Arrow: typeof PopoverArrow;
  Anchor: typeof PopoverAnchor;
  Portal: typeof PopoverPortal;
  Close: typeof PopoverClose;
};

Popover.Root = PopoverRoot;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Arrow = PopoverArrow;
Popover.Anchor = PopoverAnchor;
Popover.Portal = PopoverPortal;
Popover.Close = PopoverClose;

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverAnchor,
  PopoverPortal,
  PopoverClose,
};

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverTriggerRenderProps,
  PopoverContentOwnProps,
  PopoverContentProps,
  PopoverArrowOwnProps,
  PopoverArrowProps,
  PopoverAnchorOwnProps,
  PopoverAnchorProps,
  PopoverAnchorRenderProps,
  PopoverPortalProps,
  PopoverCloseProps,
  PopoverCloseRenderProps,
  PopoverSide,
  PopoverAlign,
  PopoverContextValue,
} from './types';
