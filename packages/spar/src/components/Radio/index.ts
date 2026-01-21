import { Radio, RadioGroup, RadioItem } from './Radio';

// Export both patterns
export {
  // Compound component (with dot notation)
  Radio,

  // Named exports (tree-shakeable)
  RadioGroup,
  RadioItem,

  // Root alias for explicit usage
  RadioGroup as RadioRoot,
};

// Export types
export type { RadioGroupProps, RadioItemProps, RadioItemRenderProps } from './types';
