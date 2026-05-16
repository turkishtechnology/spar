import { Radio as RadioRoot } from './Radio';
import { RadioItem } from './RadioItem';
export { useRadioContext } from './hooks';

const Radio = RadioRoot as typeof RadioRoot & {
  Root: typeof RadioRoot;
  Item: typeof RadioItem;
};

Radio.Root = RadioRoot;
Radio.Item = RadioItem;

export { Radio, RadioRoot, RadioItem };

export type { RadioProps, RadioItemProps, RadioItemRenderProps } from './types';
