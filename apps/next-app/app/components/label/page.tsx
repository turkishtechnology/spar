import { Label } from '@turkish-technology/spar/label';

export default function LabelPage() {
  return (
    <section>
      <h1>Label — SSR Test</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        <Label htmlFor='name-input'>Your Name</Label>
        <input id='name-input' type='text' placeholder='John Doe' />
      </div>
    </section>
  );
}
