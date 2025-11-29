import { SelectRoot } from './SelectRoot';
import { SelectTrigger } from './SelectTrigger';
import { SelectValue } from './SelectValue';
import { SelectIcon } from './SelectIcon';
import { SelectPortal } from './SelectPortal';
import { SelectContent } from './SelectContent';
import { SelectViewport } from './SelectViewport';
import { SelectItem } from './SelectItem';
import { SelectItemText } from './SelectItemText';
import { SelectItemIndicator } from './SelectItemIndicator';
import { SelectGroup } from './SelectGroup';
import { SelectLabel } from './SelectLabel';
import { SelectSeparator } from './SelectSeparator';
import { SelectArrow } from './SelectArrow';

// Create compound component with dot notation support
const Select = SelectRoot as typeof SelectRoot & {
  Root: typeof SelectRoot;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Icon: typeof SelectIcon;
  Portal: typeof SelectPortal;
  Content: typeof SelectContent;
  Viewport: typeof SelectViewport;
  Item: typeof SelectItem;
  ItemText: typeof SelectItemText;
  ItemIndicator: typeof SelectItemIndicator;
  Group: typeof SelectGroup;
  Label: typeof SelectLabel;
  Separator: typeof SelectSeparator;
  Arrow: typeof SelectArrow;
};

Select.Root = SelectRoot;
Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Icon = SelectIcon;
Select.Portal = SelectPortal;
Select.Content = SelectContent;
Select.Viewport = SelectViewport;
Select.Item = SelectItem;
Select.ItemText = SelectItemText;
Select.ItemIndicator = SelectItemIndicator;
Select.Group = SelectGroup;
Select.Label = SelectLabel;
Select.Separator = SelectSeparator;
Select.Arrow = SelectArrow;

// Export both patterns
export {
  // Compound component (with dot notation)
  Select,

  // Named exports (tree-shakeable)
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectArrow,

  // Root alias for explicit usage
  SelectRoot,
};

// Export types
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectPortalProps,
  SelectContentProps,
  SelectViewportProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectArrowProps,
  Placement,
  Strategy,
  Middleware,
  Padding,
} from './types';
