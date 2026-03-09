'use client';

import { useState } from 'react';
import * as Collapsible from '@turkish-technology/spar/collapsible';

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>Toggle content</Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ marginTop: '0.5rem' }}>This is the collapsible content that can be toggled.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
