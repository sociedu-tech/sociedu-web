'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShellNavItem } from '@/lib/dashboardNav';
import { isNavActive } from '@/lib/dashboardNav';

export type DashboardMenuState = 'full' | 'collapsed';

export type DashboardSidebarUser = {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
} | null;

export interface DashboardSidebarProps {
  items: ShellNavItem[];
  pathname: string;
  menuState: DashboardMenuState;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  user: DashboardSidebarUser;
}

/** Sidebar kiểu CMS (light): co / giấu desktop, overlay mobile. */
export function DashboardSidebar({
  items,
  pathname,
  menuState,
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
}: DashboardSidebarProps) {
  /** Chỉ hiện chữ khi mở rộng (desktop) hoặc drawer mobile mở — không mở theo hover. */
  const showText = menuState === 'full' || (isMobile && isMobileMenuOpen);

  const getSidebarWidth = () => {
    if (isMobile) return 'w-64';
    return menuState === 'collapsed' ? 'w-16' : 'w-64';
  };

  const handleNav = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const inner = (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-3">
        <Link
          href="/dashboard"
          onClick={handleNav}
          className={cn(
            'flex min-w-0 items-center gap-3 rounded-md py-1.5 transition-opacity hover:opacity-90',
            showText ? 'w-full' : 'w-full justify-center',
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Zap className="size-[18px]" strokeWidth={2.5} aria-hidden />
          </div>
          {showText ? (
            <span className="truncate text-base font-semibold tracking-tight text-gray-900">Mentoree</span>
          ) : null}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-4 no-scrollbar">
        {showText ? (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Menu</p>
        ) : null}
        {items.map((item) => {
          const active = isNavActive(pathname, item);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              title={!showText ? item.label : undefined}
              onClick={handleNav}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center rounded-md py-2 text-sm font-medium transition-colors',
                showText ? 'gap-3 px-3' : 'justify-center px-2',
                active
                  ? 'bg-primary/[0.08] font-semibold text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <item.icon
                size={18}
                strokeWidth={2}
                className={cn('shrink-0', active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600')}
              />
              {showText ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
              {!showText && (
                <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-gray-200 bg-gray-50/80">
        {showText ? (
          <div className="p-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex min-w-0 gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt=""
                      width={44}
                      height={44}
                      className="size-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="size-5 text-gray-400" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.fullName || 'Tài khoản'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500" title={user?.email}>
                    {user?.email || '—'}
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-gray-100 pt-3 text-center text-[10px] text-gray-400">
                © {new Date().getFullYear()} Mentoree
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-3">
            <div className="group relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="size-[18px] text-gray-400" strokeWidth={2} />
              )}
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 w-max max-w-[min(240px,calc(100vw-5rem))] -translate-y-1/2 rounded-md bg-gray-900 px-2.5 py-2 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                <span className="block truncate font-semibold">{user?.fullName || 'Tài khoản'}</span>
                <span className="mt-0.5 block truncate text-[11px] font-normal text-gray-300">{user?.email || '—'}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {inner}
        </aside>
        {isMobileMenuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-[65] bg-black/40"
            aria-label="Đóng menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
      </>
    );
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-[60] flex flex-col overflow-visible border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
        getSidebarWidth(),
      )}
    >
      {inner}
    </aside>
  );
}
