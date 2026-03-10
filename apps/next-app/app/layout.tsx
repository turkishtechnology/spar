import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spar App Router Test App',
  description: 'Next.js App Router app for testing @turkish-technology/spar components',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
