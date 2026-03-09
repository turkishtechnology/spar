'use client';

import { useState } from 'react';
import * as Select from '@turkish-technology/spar/select';

export function SelectDemo() {
  const [value, setValue] = useState('');

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger>
        <Select.Value placeholder='Select an option' />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value='apple'>
            <Select.ItemText>Apple</Select.ItemText>
          </Select.Item>
          <Select.Item value='banana'>
            <Select.ItemText>Banana</Select.ItemText>
          </Select.Item>
          <Select.Item value='cherry'>
            <Select.ItemText>Cherry</Select.ItemText>
          </Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value='carrot'>
            <Select.ItemText>Carrot</Select.ItemText>
          </Select.Item>
          <Select.Item value='potato'>
            <Select.ItemText>Potato</Select.ItemText>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
