import type { Metadata } from 'next';
import { Inconsolata, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/** Body/UI: Inter approximates WF Visual Sans (500–600); code: Inconsolata per DESIGN.md */
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-app',
  display: 'swap',
});

const inconsolata = Inconsolata({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mentoree',
  description: 'Kết nối mentor và học viên',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${inconsolata.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
