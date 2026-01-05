import { RadioGroup } from './RadioGroup';
import { RadioItem } from './RadioItem';

/**
 * Compound Radio component with Group and Item subcomponents.
 */
export const Radio = RadioGroup as typeof RadioGroup & {
  Group: typeof RadioGroup;
  Item: typeof RadioItem;
};

Radio.Group = RadioGroup;
Radio.Item = RadioItem;

// Named exports
export { RadioGroup, RadioItem };
