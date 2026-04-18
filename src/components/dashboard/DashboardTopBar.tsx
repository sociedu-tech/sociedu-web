'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Home, Menu } from 'lucide-react';
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
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={isMobile ? onMobileMenuToggle : onMenuToggle}
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label={isMobile ? 'Mở menu' : 'Thu gọn hoặc mở rộng sidebar'}
        >
          <Menu className="size-[18px]" strokeWidth={2} />
        </button>

        <nav
          className="hidden min-w-0 items-center gap-2 text-sm text-gray-500 sm:flex"
          aria-label="Breadcrumb"
        >
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-1 transition-colors hover:text-gray-900"
          >
            <Home className="size-4 shrink-0" strokeWidth={2} />
            <span className="hidden md:inline">Bảng điều khiển</span>
          </Link>
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-2">
              <span className="text-gray-300">/</span>
              {c.href ? (
                <Link href={c.href} className="truncate transition-colors hover:text-gray-900">
                  {c.label}
                </Link>
              ) : (
                <span className="truncate font-medium text-gray-900">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Thông báo"
        >
          <Bell className="size-[18px]" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
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
