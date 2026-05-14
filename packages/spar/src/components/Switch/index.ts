import { Switch as LegacySwitch } from './Switch';
import { SwitchRoot } from './SwitchRoot';
import { SwitchControl } from './SwitchControl';
import { SwitchTrack } from './SwitchTrack';
import { SwitchThumb } from './SwitchThumb';
import { SwitchLabel } from './SwitchLabel';
import { SwitchHint } from './SwitchHint';

const Switch = LegacySwitch as typeof LegacySwitch & {
  Root: typeof SwitchRoot;
  Control: typeof SwitchControl;
  Track: typeof SwitchTrack;
  Thumb: typeof SwitchThumb;
  Label: typeof SwitchLabel;
  Hint: typeof SwitchHint;
};

Switch.Root = SwitchRoot;
Switch.Control = SwitchControl;
Switch.Track = SwitchTrack;
Switch.Thumb = SwitchThumb;
Switch.Label = SwitchLabel;
Switch.Hint = SwitchHint;

export { useSwitch, useSwitchContext } from './hooks';

export { Switch, SwitchRoot, SwitchControl, SwitchTrack, SwitchThumb, SwitchLabel, SwitchHint };

export type {
  SwitchContextValue,
  SwitchControlProps,
  SwitchHintProps,
  SwitchLabelProps,
  SwitchProps,
  SwitchRenderProps,
  SwitchRootProps,
  SwitchThumbProps,
  SwitchTrackProps,
} from './types';
