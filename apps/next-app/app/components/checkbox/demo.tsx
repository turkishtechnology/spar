'use client';

import { useState } from 'react';
import { Checkbox } from '@turkish-technology/spar/checkbox';
import { Label } from '@turkish-technology/spar/label';
import type { CheckedState } from '@turkish-technology/spar';

export function CheckboxDemo() {
  const [checked, setChecked] = useState<CheckedState>(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
      <Checkbox id='terms' checked={checked} onChange={setChecked} />
      <Label htmlFor='terms'>Accept terms and conditions</Label>
    </div>
  );
}
