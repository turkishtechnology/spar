import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spar SSR Test App',
  description: 'Next.js app for testing @turkish-technology/spar components in SSR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
