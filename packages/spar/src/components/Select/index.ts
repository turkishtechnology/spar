import { Select as SelectRoot } from './Select';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';
import { SelectContent } from './SelectContent';
import { SelectItem } from './SelectItem';
import { SelectGroup } from './SelectGroup';
import { SelectLabel } from './SelectLabel';
import { SelectItemText } from './SelectItemText';
import { SelectSeparator } from './SelectSeparator';
import { SelectArrow } from './SelectArrow';
export {
  useSelectContext,
  useSelectGroupContext,
  useSelectItemContext,
  useSelectCollectionContext,
} from './hooks';

const Select = SelectRoot as typeof SelectRoot & {
  Root: typeof SelectRoot;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Content: typeof SelectContent;
  Item: typeof SelectItem;
  Group: typeof SelectGroup;
  Label: typeof SelectLabel;
  ItemText: typeof SelectItemText;
  Separator: typeof SelectSeparator;
  Arrow: typeof SelectArrow;
};

Select.Root = SelectRoot;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Content = SelectContent;
Select.Item = SelectItem;
Select.Group = SelectGroup;
Select.Label = SelectLabel;
Select.ItemText = SelectItemText;
Select.Separator = SelectSeparator;
Select.Arrow = SelectArrow;

export {
  Select,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectItemText,
  SelectSeparator,
  SelectArrow,
};

export type {
  SelectProps,
  SelectTriggerProps,
  SelectTriggerRenderProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectItemRenderProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemTextProps,
  SelectSeparatorProps,
  SelectArrowProps,
  SelectContextValue,
} from './types';
