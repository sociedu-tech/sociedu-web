import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

/** Font riêng khu vực chỉnh hồ sơ — thường thấy trên template CMS / admin hiện đại */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function DashboardProfileEditLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${plusJakarta.className} text-[15px] leading-relaxed text-gray-800 antialiased`}>
      {children}
    </div>
  );
}
