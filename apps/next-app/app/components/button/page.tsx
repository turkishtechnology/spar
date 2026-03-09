import { Button } from '@turkish-technology/spar/button';

export default function ButtonPage() {
  return (
    <section>
      <h1>Button — SSR Test</h1>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
      </div>
    </section>
  );
}
