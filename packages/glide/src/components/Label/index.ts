import { Label, LabelRoot, LabelText, LabelIndicator } from './Label';

// Aliased exports for grouped usage
const Root = LabelRoot;
const Text = LabelText;
const Indicator = LabelIndicator;

// Export both named components AND aliases
export {
  // Named exports (for direct imports)
  Label,
  LabelRoot,
  LabelText,
  LabelIndicator,

  // Aliased exports (for grouped pattern)
  Root,
  Text,
  Indicator,
};

// Export types
export type {
  LabelRootProps,
  LabelTextProps,
  LabelIndicatorProps,
  LabelSize,
  LabelVariant,
  LabelIndicatorType,
  LabelContextValue,
} from './Label.types';

// Usage examples:
// Direct import: import { LabelRoot, LabelText } from '@glide/components';
// Grouped import: import { Root, Text, Indicator } from '@glide/components/Label';
// Simple usage: import { Label } from '@glide/components';
