'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { getShellNavItems } from '@/lib/dashboardNav';
import { DashboardSidebar, type DashboardMenuState } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname() || '/dashboard';
  const navItems = getShellNavItems(
    user?.roles?.[0] != null ? normalizeRole(user.roles[0]) : ROLES.GUEST,
    user?.id,
  );

  const [menuState, setMenuState] = useState<DashboardMenuState>('full');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mq = () => window.innerWidth < 1024;
    setIsMobile(mq());
    const onResize = () => {
      const m = mq();
      setIsMobile(m);
      if (m) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /** Chỉ 2 trạng thái: mở rộng ↔ thu gọn (không ẩn hẳn sidebar — tránh bấm 2 lần là mất menu). */
  const toggleMenuState = useCallback(() => {
    setMenuState((prev) => (prev === 'full' ? 'collapsed' : 'full'));
  }, []);

  const marginLeft = (() => {
    if (isMobile) return '0';
    return menuState === 'collapsed' ? '4.25rem' : '17.5rem';
  })();

  const profileHref =
    user?.id != null && String(user.id).length > 0 ? `/profile/${user.id}` : '/profile';

  const isChatPage =
    pathname === '/dashboard/chat' || pathname.startsWith('/dashboard/chat/');

  return (
    <div
      className={cn(
        'flex flex-col bg-[#f7f7f7] font-sans text-[15px] font-normal leading-relaxed text-slate-800 antialiased',
        isChatPage ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen',
      )}
    >
      <DashboardSidebar
        items={navItems}
        pathname={pathname}
        menuState={menuState}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={user}
      />

      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out',
          isChatPage && 'h-[100dvh] overflow-hidden',
        )}
        style={{ marginLeft }}
      >
        <DashboardTopBar
          pathname={pathname}
          onMenuToggle={toggleMenuState}
          onMobileMenuToggle={() => setIsMobileMenuOpen((o) => !o)}
          isMobile={isMobile}
          user={user}
          profileHref={profileHref}
          onLogout={logout}
        />
        <main
          className={cn(
            'min-h-0 flex-1 bg-[#f7f7f7]',
            isChatPage ? 'flex flex-col overflow-hidden' : 'overflow-y-auto overflow-x-hidden',
          )}
        >
          <div
            className={cn(
              isChatPage
                ? 'flex h-full min-h-0 w-full max-w-none flex-1 flex-col px-0 py-0'
                : 'mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8',
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
