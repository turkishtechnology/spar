import { Switch as LegacySwitch } from './Switch';
import { SwitchRoot } from './SwitchRoot';
import { SwitchControl } from './SwitchControl';
import { SwitchTrack } from './SwitchTrack';
import { SwitchThumb } from './SwitchThumb';

const Switch = LegacySwitch as typeof LegacySwitch & {
  Root: typeof SwitchRoot;
  Control: typeof SwitchControl;
  Track: typeof SwitchTrack;
  Thumb: typeof SwitchThumb;
};

Switch.Root = SwitchRoot;
Switch.Control = SwitchControl;
Switch.Track = SwitchTrack;
Switch.Thumb = SwitchThumb;

export { useSwitch, useSwitchContext } from './hooks';

export { Switch, SwitchRoot, SwitchControl, SwitchTrack, SwitchThumb };

export type {
  SwitchContextValue,
  SwitchControlProps,
  SwitchProps,
  SwitchRenderProps,
  SwitchRootProps,
  SwitchThumbProps,
  SwitchTrackProps,
} from './types';
