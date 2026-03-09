'use client';

import * as Popover from '@turkish-technology/spar/popover';

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Content>
        <p>This is the popover content.</p>
        <Popover.Arrow />
        <Popover.Close>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}
