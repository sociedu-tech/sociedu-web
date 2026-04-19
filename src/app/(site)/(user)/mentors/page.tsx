import type { Metadata } from 'next';
import Script from 'next/script';
import { MentorMarketplace } from '@/features/mentor/views/MentorMarketplace';

export const metadata: Metadata = {
  title: 'Tìm mentor kèm đồ án, BTL, NCKH cho sinh viên | Mentoree',
  description:
    'Mentoree kết nối sinh viên Việt Nam với mentor là anh chị đi trước — kèm 1-1 đồ án môn học, bài tập lớn (BTL), đồ án tốt nghiệp (ĐATN), nghiên cứu khoa học (NCKH), khóa luận và luyện phỏng vấn thực tập.',
  keywords: [
    'mentor sinh viên',
    'kèm đồ án',
    'kèm BTL',
    'bài tập lớn',
    'đồ án tốt nghiệp',
    'ĐATN',
    'nghiên cứu khoa học',
    'NCKH sinh viên',
    'khóa luận',
    'luyện phỏng vấn thực tập',
    'review CV sinh viên',
    'Mentoree',
    'UniShare',
  ],
  alternates: { canonical: '/mentors' },
  openGraph: {
    title: 'Tìm mentor kèm đồ án, BTL, NCKH cho sinh viên | Mentoree',
    description:
      'Kết nối với anh chị đi trước và chuyên gia để được kèm 1-1 đồ án, BTL, NCKH, khóa luận và luyện phỏng vấn thực tập.',
    url: '/mentors',
    siteName: 'Mentoree',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tìm mentor kèm đồ án, BTL, NCKH cho sinh viên | Mentoree',
    description:
      'Kết nối với anh chị đi trước và chuyên gia để được kèm 1-1 đồ án, BTL, NCKH, khóa luận và luyện phỏng vấn thực tập.',
  },
  robots: { index: true, follow: true },
};

/** JSON-LD giúp bot hiểu đây là trang danh bạ mentor cho sinh viên Việt Nam. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Danh bạ mentor sinh viên — Mentoree',
  description:
    'Danh sách mentor hỗ trợ sinh viên Việt Nam trong đồ án môn học, bài tập lớn, đồ án tốt nghiệp, nghiên cứu khoa học, khóa luận và luyện phỏng vấn thực tập.',
  inLanguage: 'vi-VN',
  about: {
    '@type': 'Service',
    serviceType: 'Kèm 1-1 cho sinh viên: đồ án, BTL, NCKH, khóa luận, thực tập',
    provider: { '@type': 'Organization', name: 'Mentoree', url: '/' },
    areaServed: 'VN',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  },
};

export default function MentorsPage() {
  return (
    <>
      <Script
        id="ld-mentors"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MentorMarketplace />
    </>
  );
}
