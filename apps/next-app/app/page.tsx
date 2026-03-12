import Link from 'next/link';

const components = [
  'accordion',
  'breadcrumb',
  'button',
  'checkbox',
  'collapsible',
  'dialog',
  'dropdown-menu',
  'input',
  'label',
  'popover',
  'radio',
  'select',
  'switch',
  'tabs',
  'tooltip',
];

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Spar App Router Test App</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
        Each component page is tested inside the Next.js App Router. Interactive examples use a
        client boundary where needed.
      </p>

      <nav>
        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
          {components.map((name) => (
            <li key={name}>
              <Link
                href={`/components/${name}`}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  textTransform: 'capitalize',
                }}
              >
                {name.replace('-', ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
