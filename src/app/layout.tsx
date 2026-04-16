import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Inconsolata } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/** Body/UI: Be Vietnam Pro renders Vietnamese cleanly; code: Inconsolata per DESIGN.md */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="vi" className={`${beVietnamPro.variable} ${inconsolata.variable}`}>
      <body className={`${beVietnamPro.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
