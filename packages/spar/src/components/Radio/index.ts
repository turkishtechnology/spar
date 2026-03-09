import { RadioGroup as RadioRoot } from './RadioGroup';
import { RadioItem } from './RadioItem';
export { useRadioGroupContext } from './hooks';

const Radio = RadioRoot as typeof RadioRoot & {
  Root: typeof RadioRoot;
  Group: typeof RadioRoot;
  Item: typeof RadioItem;
};

Radio.Root = RadioRoot;
Radio.Group = RadioRoot;
Radio.Item = RadioItem;

export { Radio, RadioRoot, RadioRoot as RadioGroup, RadioItem };

export type { RadioGroupProps, RadioItemProps, RadioItemRenderProps } from './types';
