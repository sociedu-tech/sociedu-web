'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { getShellNavItems } from '@/lib/dashboardNav';
import { DashboardSidebar, type DashboardMenuState } from '@/features/dashboard/ui/DashboardSidebar';
import { DashboardTopBar } from '@/features/dashboard/ui/DashboardTopBar';

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

  const toggleMenuState = useCallback(() => {
    setMenuState((prev) => (prev === 'full' ? 'collapsed' : 'full'));
  }, []);

  const marginLeft = (() => {
    if (isMobile) return '0';
    return menuState === 'collapsed' ? '3.5rem' : '17.5rem';
  })();

  const profileHref =
    user?.id != null && String(user.id).length > 0 ? `/profile/${user.id}` : '/profile';

  const isChatPage =
    pathname === '/dashboard/chat' || pathname.startsWith('/dashboard/chat/');

  const isOrderDetailPage =
    /^\/dashboard\/my-orders\/[^/]+$/.test(pathname) ||
    /^\/dashboard\/orders\/[^/]+$/.test(pathname);

  const lockMainScroll = isChatPage || isOrderDetailPage;

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-slate-50 font-sans text-[15px] font-normal leading-relaxed text-slate-800 antialiased">
      <DashboardSidebar
        items={navItems}
        pathname={pathname}
        menuState={menuState}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onMenuToggle={toggleMenuState}
        user={user}
      />

      <div
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out"
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
            'flex min-h-0 flex-1 flex-col bg-slate-50',
            lockMainScroll ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden',
          )}
        >
          <div
            className={cn(
              'w-full',
              lockMainScroll
                ? 'flex min-h-0 w-full flex-1 flex-col h-full px-0 py-0'
                : 'min-h-full px-4 py-8 sm:px-6 lg:px-8',
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
