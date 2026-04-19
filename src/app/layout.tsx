import type { Metadata, Viewport } from 'next';
import { Inter, Inconsolata } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

/** UI: Inter — đọc tốt cho dashboard/SaaS, hỗ trợ Latin + tiếng Việt; code: Inconsolata */
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
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
  title: {
    default: 'Mentoree · Mentor kèm đồ án, BTL, NCKH cho sinh viên Việt Nam',
    template: '%s | Mentoree',
  },
  description:
    'Mentoree kết nối sinh viên Việt Nam với mentor là anh chị đi trước: kèm 1-1 đồ án môn học, bài tập lớn (BTL), đồ án tốt nghiệp (ĐATN), nghiên cứu khoa học (NCKH), khóa luận và luyện phỏng vấn thực tập.',
  keywords: [
    'mentor sinh viên',
    'kèm đồ án',
    'kèm BTL',
    'đồ án tốt nghiệp',
    'nghiên cứu khoa học sinh viên',
    'NCKH',
    'khóa luận',
    'luyện phỏng vấn thực tập',
    'Mentoree',
    'UniShare',
  ],
  applicationName: 'Mentoree',
  authors: [{ name: 'Mentoree' }],
  openGraph: {
    type: 'website',
    siteName: 'Mentoree',
    locale: 'vi_VN',
    title: 'Mentoree · Mentor kèm đồ án, BTL, NCKH cho sinh viên Việt Nam',
    description:
      'Kết nối với anh chị đi trước và chuyên gia để được kèm 1-1 đồ án, BTL, NCKH, khóa luận và luyện phỏng vấn thực tập.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentoree · Mentor kèm đồ án, BTL, NCKH cho sinh viên Việt Nam',
    description:
      'Kết nối với anh chị đi trước và chuyên gia để được kèm 1-1 đồ án, BTL, NCKH, khóa luận và luyện phỏng vấn thực tập.',
  },
  robots: { index: true, follow: true },
};

/**
 * Viewport chuẩn App Router — tránh scale lạ trên mobile, vẫn cho phép zoom (a11y).
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${inconsolata.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
