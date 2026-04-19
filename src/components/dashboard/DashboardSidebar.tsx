'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShellNavItem } from '@/lib/dashboardNav';
import { groupShellNavItems, isNavActive } from '@/lib/dashboardNav';

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

const navTooltip =
  'pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 opacity-0 shadow-md ring-1 ring-slate-950/5 transition-opacity group-hover:opacity-100';

/** Sidebar sáng — bố cục admin: cột trái cố định, nền trắng, accent primary. */
export function DashboardSidebar({
  items,
  pathname,
  menuState,
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
}: DashboardSidebarProps) {
  const showText = menuState === 'full' || (isMobile && isMobileMenuOpen);
  const groups = groupShellNavItems(items);

  const getSidebarWidth = () => {
    if (isMobile) return 'w-[17.5rem]';
    return menuState === 'collapsed' ? 'w-[4.25rem]' : 'w-[17.5rem]';
  };

  const handleNav = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const inner = (
    <>
      <div className="flex h-[4.25rem] shrink-0 items-center border-b border-slate-200 bg-white px-3">
        <Link
          href="/dashboard"
          onClick={handleNav}
          className={cn(
            'flex min-w-0 items-center gap-3 rounded-xl py-1.5 transition-colors hover:bg-slate-50',
            showText ? 'w-full' : 'w-full justify-center',
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Zap className="size-[18px]" strokeWidth={2.5} aria-hidden />
          </div>
          {showText ? (
            <span className="truncate text-[15px] font-semibold tracking-tight text-slate-900">Mentoree</span>
          ) : null}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden px-2.5 py-4 no-scrollbar">
        {groups.map((section, sectionIdx) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            {showText ? (
              <p className="mb-1.5 px-3 text-[10px] font-semibold  text-slate-400">
                {section.title}
              </p>
            ) : sectionIdx > 0 ? (
              <div className="mx-auto mb-2 mt-1 h-px w-8 bg-slate-200" aria-hidden />
            ) : null}
            {section.items.map((item) => {
              const active = isNavActive(pathname, item);
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  title={!showText ? item.label : undefined}
                  onClick={handleNav}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group flex items-center rounded-xl py-2.5 text-[13px] font-medium transition-colors',
                    showText ? 'gap-3 px-3' : 'justify-center px-2',
                    active
                      ? 'bg-slate-100 font-semibold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  <item.icon
                    size={18}
                    strokeWidth={2}
                    className={cn(
                      'shrink-0',
                      active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600',
                    )}
                  />
                  {showText ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                  {!showText && <span className={navTooltip}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200 bg-slate-50/80 p-3">
        {showText ? (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
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
                  <User className="size-4 text-slate-400" strokeWidth={2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName || 'Tài khoản'}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500" title={user?.email}>
                  {user?.email || '—'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="group relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
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
                <User className="size-[18px] text-slate-400" strokeWidth={2} />
              )}
              <span
                className={cn(
                  navTooltip,
                  'w-max max-w-[min(240px,calc(100vw-5rem))] py-2 text-left',
                )}
              >
                <span className="block truncate font-semibold text-slate-900">{user?.fullName || 'Tài khoản'}</span>
                <span className="mt-0.5 block truncate text-[11px] font-normal text-slate-500">{user?.email || '—'}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const shellClass =
    'fixed inset-y-0 left-0 z-[70] flex flex-col overflow-visible border-r border-slate-200 bg-white transition-all duration-300 ease-in-out';

  if (isMobile) {
    return (
      <>
        <aside
          className={cn(shellClass, 'w-[17.5rem]', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')}
        >
          {inner}
        </aside>
        {isMobileMenuOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-[65] bg-slate-900/25 backdrop-blur-[1px]"
            aria-label="Đóng menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
      </>
    );
  }

  return (
    <aside className={cn(shellClass, 'z-[60]', getSidebarWidth())}>{inner}</aside>
  );
}
