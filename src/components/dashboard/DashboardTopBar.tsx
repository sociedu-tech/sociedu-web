'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, Home, Menu } from 'lucide-react';
import { getDashboardBreadcrumb } from '@/lib/dashboardNav';
import { UserAvatarMenu, type UserAvatarMenuUser } from '@/components/ui/UserAvatarMenu';

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
  onMenuToggle,
  onMobileMenuToggle,
  isMobile,
  user,
  profileHref,
  onLogout,
}: DashboardTopBarProps) {
  const crumbs = getDashboardBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 bg-[#f7f7f7] px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Mở menu"
          >
            <Menu className="size-[18px]" strokeWidth={2} />
          </button>
        )}

        <nav
          className="hidden min-w-0 items-center gap-1 text-[13px] text-slate-500 sm:flex"
          aria-label="Breadcrumb"
        >
          <Link
            href="/dashboard"
            aria-label="Trang chủ dashboard"
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Home className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
          </Link>
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight className="size-3.5 shrink-0 text-slate-300" strokeWidth={2} aria-hidden />
              {c.href ? (
                <Link href={c.href} className="truncate rounded-lg px-1.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  {c.label}
                </Link>
              ) : (
                <span className="truncate rounded-lg px-1.5 py-1 font-medium text-slate-900">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Thông báo"
        >
          <Bell className="size-[18px]" strokeWidth={2} />
        </button>

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
