import { Select as SelectRoot } from './Select';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';
import { SelectIcon } from './SelectIcon';
import { SelectContent } from './SelectContent';
import { SelectItem } from './SelectItem';
import { SelectGroup } from './SelectGroup';
import { SelectLabel } from './SelectLabel';
import { SelectItemText } from './SelectItemText';
import { SelectItemIndicator } from './SelectItemIndicator';
import { SelectSeparator } from './SelectSeparator';
import { SelectArrow } from './SelectArrow';
export { useSelectContext, useSelectGroupContext, useSelectItemContext } from './hooks';

const Select = SelectRoot as typeof SelectRoot & {
  Root: typeof SelectRoot;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Content: typeof SelectContent;
  Item: typeof SelectItem;
  Group: typeof SelectGroup;
  Label: typeof SelectLabel;
  ItemText: typeof SelectItemText;
  ItemIndicator: typeof SelectItemIndicator;
  Separator: typeof SelectSeparator;
  Arrow: typeof SelectArrow;
};

Select.Root = SelectRoot;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Content = SelectContent;
Select.Item = SelectItem;
Select.Group = SelectGroup;
Select.Label = SelectLabel;
Select.ItemText = SelectItemText;
Select.ItemIndicator = SelectItemIndicator;
Select.Separator = SelectSeparator;
Select.Arrow = SelectArrow;

export {
  Select,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectItemText,
  SelectItemIndicator,
  SelectSeparator,
  SelectArrow,
};

export type {
  SelectProps,
  SelectTriggerProps,
  SelectTriggerRenderProps,
  SelectValueProps,
  SelectIconProps,
  SelectContentProps,
  SelectItemProps,
  SelectItemRenderProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectSeparatorProps,
  SelectArrowProps,
  SelectContextValue,
} from './types';
