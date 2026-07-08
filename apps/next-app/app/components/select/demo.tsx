'use client';

import { useState } from 'react';
import * as Select from '@turkish-technology/spar/select';

export function SelectDemo() {
  const [value, setValue] = useState('');

  return (
    <Select.Root
      value={value}
      onChange={(next) => setValue(Array.isArray(next) ? (next[0] ?? '') : next)}
    >
      <Select.Trigger placeholder='Select an option' />
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value='apple' label='Apple'>
            Apple
          </Select.Item>
          <Select.Item value='banana' label='Banana'>
            Banana
          </Select.Item>
          <Select.Item value='cherry' label='Cherry'>
            Cherry
          </Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value='carrot' label='Carrot'>
            Carrot
          </Select.Item>
          <Select.Item value='potato' label='Potato'>
            Potato
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
