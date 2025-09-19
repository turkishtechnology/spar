import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './DropdownMenu';

// Create aliases for grouped pattern usage
const Root = DropdownMenu;
const Trigger = DropdownMenuTrigger;
const Content = DropdownMenuContent;
const Item = DropdownMenuItem;
const CheckboxItem = DropdownMenuCheckboxItem;
const RadioGroup = DropdownMenuRadioGroup;
const RadioItem = DropdownMenuRadioItem;
const Separator = DropdownMenuSeparator;
const Label = DropdownMenuLabel;
const Group = DropdownMenuGroup;
const Sub = DropdownMenuSub;
const SubTrigger = DropdownMenuSubTrigger;
const SubContent = DropdownMenuSubContent;

// Export both patterns
export {
  // Named exports (for direct imports - tree-shakeable)
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,

  // Aliased exports (for grouped usage pattern)
  Root,
  Trigger,
  Content,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Separator,
  Label,
  Group,
  Sub,
  SubTrigger,
  SubContent,
};

// Export types
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
  DropdownMenuGroupProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  CheckedState,
  Side,
  Align,
} from './types';
