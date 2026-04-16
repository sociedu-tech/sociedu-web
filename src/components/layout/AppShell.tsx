'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-0 z-[200] -translate-y-[120%] rounded-b-[4px] bg-primary px-4 py-2 text-sm font-medium text-white shadow-glass outline-none ring-offset-2 transition-transform focus:translate-y-4 focus:ring-2 focus:ring-primary"
      >
        Bỏ qua điều hướng, tới nội dung chính
      </a>
      <Navbar />
      <div id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
