import { Popover as PopoverRoot } from './Popover';
import { PopoverTrigger } from './PopoverTrigger';
import { PopoverContent } from './PopoverContent';
import { PopoverArrow } from './PopoverArrow';
import { PopoverClose } from './PopoverClose';
export { usePopoverContext } from './hooks';

const Popover = PopoverRoot as typeof PopoverRoot & {
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Arrow: typeof PopoverArrow;
  Close: typeof PopoverClose;
};

Popover.Root = PopoverRoot;
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Arrow = PopoverArrow;
Popover.Close = PopoverClose;

export { Popover, PopoverRoot, PopoverTrigger, PopoverContent, PopoverArrow, PopoverClose };

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverTriggerRenderProps,
  PopoverContentOwnProps,
  PopoverContentProps,
  PopoverArrowOwnProps,
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverCloseRenderProps,
  PopoverContextValue,
} from './types';
