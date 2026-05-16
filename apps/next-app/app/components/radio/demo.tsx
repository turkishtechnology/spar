'use client';

import { useState } from 'react';
import * as Radio from '@turkish-technology/spar/radio';

export function RadioDemo() {
  const [value, setValue] = useState('option-a');

  return (
    <Radio.Root value={value} onChange={setValue}>
      <Radio.Item value='option-a'>Option A</Radio.Item>
      <Radio.Item value='option-b'>Option B</Radio.Item>
      <Radio.Item value='option-c'>Option C</Radio.Item>
    </Radio.Root>
  );
}
