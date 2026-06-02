'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Menu } from 'lucide-react';
import { getDashboardBreadcrumb, getDashboardTitle } from '@/lib/dashboardNav';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { UserAvatarMenu, type UserAvatarMenuUser } from '@/components/ui/UserAvatarMenu';
import { cn } from '@/lib/utils';

type DashboardTopBarProps = {
  pathname: string;
  onMenuToggle: () => void;
  onMobileMenuToggle: () => void;
  isMobile: boolean;
  user: UserAvatarMenuUser | null;
  profileHref: string;
  onLogout: () => void;
};

export function DashboardTopBar({
  pathname,
  onMobileMenuToggle,
  isMobile,
  user,
  profileHref,
  onLogout,
}: DashboardTopBarProps) {
  const crumbs = getDashboardBreadcrumb(pathname);
  const pageTitle = getDashboardTitle(pathname);

  return (
    <header
      className={cn(
        'z-50 flex h-14 shrink-0 items-center justify-between gap-4',
        'border-b border-dashboard-border/80 bg-dashboard-surface/95 px-4 backdrop-blur-sm lg:px-6',
      )}
      style={{ boxShadow: 'var(--shadow-dashboard-card)' }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-dashboard-border bg-dashboard-surface text-dashboard-ink-secondary transition-colors hover:bg-dashboard-canvas"
            aria-label="Mở menu"
          >
            <Menu className="size-[18px]" strokeWidth={2} />
          </button>
        )}

        {isMobile && pageTitle ? (
          <p className="min-w-0 truncate text-sm font-semibold text-dashboard-ink">{pageTitle}</p>
        ) : (
          <nav
            className="flex min-w-0 items-center gap-0.5 text-[13px] text-dashboard-muted"
            aria-label="Breadcrumb"
          >
            <Link
              href="/dashboard"
              aria-label="Trang chủ dashboard"
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-dashboard-canvas hover:text-dashboard-ink"
            >
              <Home className="size-4 shrink-0 text-dashboard-subtle" strokeWidth={2} />
            </Link>
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-0.5">
                <ChevronRight className="size-3.5 shrink-0 text-dashboard-border" strokeWidth={2} aria-hidden />
                {c.href ? (
                  <Link
                    href={c.href}
                    className="truncate rounded-lg px-2 py-1.5 transition-colors hover:bg-dashboard-canvas hover:text-dashboard-ink"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate rounded-lg px-2 py-1.5 font-medium text-dashboard-ink">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <NotificationBell />

        <UserAvatarMenu
          variant="dashboard"
          user={user}
          profileHref={profileHref}
          onLogout={onLogout}
          className="pl-1"
        />
      </div>
    </header>
  );
}
