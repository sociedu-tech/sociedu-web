import type { Metadata } from 'next';
import Script from 'next/script';
import { LandingPage } from '@/views/LandingPage';

export const metadata: Metadata = {
  title: 'Mentoree · Mentor kèm đồ án, BTL, NCKH cho sinh viên Việt Nam',
  description:
    'Nền tảng mentor 1-1 cho sinh viên Việt Nam. Đặt lịch kèm đồ án môn học, bài tập lớn, đồ án tốt nghiệp, nghiên cứu khoa học, khóa luận và luyện phỏng vấn thực tập với anh chị đi trước.',
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mentoree',
  url: '/',
  logo: '/next.svg',
  description:
    'Nền tảng mentor 1-1 cho sinh viên Việt Nam — kèm đồ án, BTL, NCKH, khóa luận và luyện phỏng vấn thực tập.',
  areaServed: 'VN',
  sameAs: [],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Mentoree hỗ trợ những loại đồ án nào cho sinh viên?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mentor có thể đồng hành với bài tập lớn (BTL), đồ án môn học, đồ án chuyên ngành, đồ án tốt nghiệp (ĐATN), khóa luận, tiểu luận và đề tài nghiên cứu khoa học (NCKH) sinh viên.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mentoree có làm hộ đồ án hay viết thuê không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Không. Mentor chỉ hướng dẫn, review, góp ý và luyện bảo vệ — giúp bạn tự hoàn thiện sản phẩm của mình, tránh rủi ro vi phạm quy chế học thuật.',
      },
    },
    {
      '@type': 'Question',
      name: 'Chi phí một buổi kèm là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mức giá do mentor tự đặt, hiển thị công khai. Có gói buổi lẻ và gói theo dự án (kèm tới lúc nộp/bảo vệ) để sinh viên chọn theo ngân sách.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="ld-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <LandingPage />
    </>
  );
}
