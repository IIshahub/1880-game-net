import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Game Collection',
  description: 'Collection of fun games',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

