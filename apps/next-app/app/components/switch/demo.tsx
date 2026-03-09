'use client';

import { useState } from 'react';
import { Switch } from '@turkish-technology/spar/switch';
import { Label } from '@turkish-technology/spar/label';

export function SwitchDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
      <Switch id='dark-mode' checked={checked} onChange={setChecked} />
      <Label htmlFor='dark-mode'>Dark Mode</Label>
    </div>
  );
}
