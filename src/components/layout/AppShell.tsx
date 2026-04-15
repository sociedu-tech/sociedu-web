'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname.startsWith('/mentor') || pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <div className="flex-1">{children}</div>
      {!hideChrome && <Footer />}
    </div>
  );
}
