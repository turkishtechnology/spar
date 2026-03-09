'use client';

import * as Tooltip from '@turkish-technology/spar/tooltip';

export function TooltipDemo() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>
          This is a tooltip
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
