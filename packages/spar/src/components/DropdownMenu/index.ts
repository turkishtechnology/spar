import { DropdownMenu as DropdownMenuRoot } from './DropdownMenu';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuArrow } from './DropdownMenuArrow';
export { useDropdownMenuContext, useDropdownMenuCollectionContext } from './hooks';

const DropdownMenu = DropdownMenuRoot as typeof DropdownMenuRoot & {
  Root: typeof DropdownMenuRoot;
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  Separator: typeof DropdownMenuSeparator;
  Label: typeof DropdownMenuLabel;
  Group: typeof DropdownMenuGroup;
  Arrow: typeof DropdownMenuArrow;
};

DropdownMenu.Root = DropdownMenuRoot;
DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Arrow = DropdownMenuArrow;

export {
  DropdownMenu,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuArrow,
};

export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuTriggerRenderProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
  DropdownMenuGroupProps,
  DropdownMenuArrowProps,
} from './types';
