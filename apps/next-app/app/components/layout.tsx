import Link from 'next/link';

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link href='/' style={{ fontSize: '0.875rem' }}>
          &larr; Ana Sayfa
        </Link>
      </nav>
      {children}
    </main>
  );
}
