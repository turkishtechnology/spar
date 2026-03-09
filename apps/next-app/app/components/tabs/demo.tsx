'use client';

import { useState } from 'react';
import * as Tabs from '@turkish-technology/spar/tabs';

export function TabsDemo() {
  const [value, setValue] = useState('tab1');

  return (
    <Tabs.Root value={value} onValueChange={setValue}>
      <Tabs.List>
        <Tabs.Trigger value='tab1'>Tab 1</Tabs.Trigger>
        <Tabs.Trigger value='tab2'>Tab 2</Tabs.Trigger>
        <Tabs.Trigger value='tab3'>Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='tab1'>
        <p>Content for Tab 1</p>
      </Tabs.Content>
      <Tabs.Content value='tab2'>
        <p>Content for Tab 2</p>
      </Tabs.Content>
      <Tabs.Content value='tab3'>
        <p>Content for Tab 3</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
