import { Radio, RadioGroup, RadioItem } from './Radio';

// Aliased exports for grouped usage
const Root = RadioGroup;
const Group = RadioGroup;
const Item = RadioItem;

// Export both named components AND aliases
export {
  // Named exports (for direct imports)
  Radio,
  RadioGroup,
  RadioItem,

  // Aliased exports (for grouped pattern)
  Root,
  Group,
  Item,
};

// Export types
export type { RadioGroupProps, RadioItemProps, Orientation } from './types';
