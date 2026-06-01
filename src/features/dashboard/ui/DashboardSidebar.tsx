'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Zap, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShellNavItem } from '@/lib/dashboardNav';
import { groupShellNavItems, isNavActive } from '@/lib/dashboardNav';
import { useChatUnreadTotal } from '@/hooks/useChatUnreadTotal';
import { ROUTES } from '@/constants/routes';

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
  onMenuToggle: () => void;
  user: DashboardSidebarUser;
}

const navTooltip =
  'pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg border border-dashboard-border bg-dashboard-surface px-2.5 py-1.5 text-xs font-medium text-dashboard-ink opacity-0 shadow-[var(--shadow-dashboard-elevated)] transition-opacity group-hover:opacity-100';

/** Sidebar nền trầm (slate) — accent primary giữ nguyên trên logo. */
export function DashboardSidebar({
  items,
  pathname,
  menuState,
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onMenuToggle,
  user,
}: DashboardSidebarProps) {
  const showText = menuState === 'full' || (isMobile && isMobileMenuOpen);
  const groups = groupShellNavItems(items);
  const chatUnreadTotal = useChatUnreadTotal();
  const chatPath = ROUTES.DASHBOARD.SHARED.CHAT.path;
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const getSidebarWidth = () => {
    if (isMobile) return 'w-[17.5rem]';
    return menuState === 'collapsed' ? 'w-14' : 'w-[17.5rem]';
  };

  const handleNav = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const inner = (
    <>
      <div className="relative flex h-14 shrink-0 items-center border-b border-dashboard-sidebar-border bg-dashboard-sidebar px-3">
        <Link
          href="/"
          onClick={handleNav}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-3 rounded-xl py-1.5 transition-colors hover:bg-dashboard-sidebar-hover/80',
            showText ? 'w-full' : 'w-full justify-center',
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Zap className="size-[18px]" strokeWidth={2.5} aria-hidden />
          </div>
          {showText ? (
            <span className="truncate text-[15px] font-semibold tracking-tight text-white">Mentoree</span>
          ) : null}
        </Link>
        {!isMobile && (
          <button
            onClick={onMenuToggle}
            className="absolute -right-3.5 top-[14px] z-50 hidden size-7 items-center justify-center rounded-full border border-dashboard-sidebar-border bg-dashboard-sidebar-hover text-dashboard-sidebar-muted shadow-[var(--shadow-dashboard-card)] transition-colors hover:bg-dashboard-sidebar-hover hover:text-white lg:flex"
            title={showText ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
          >
            {showText ? (
              <ChevronLeft className="size-4" strokeWidth={2.5} />
            ) : (
              <ChevronRight className="size-4" strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden px-2.5 py-4 no-scrollbar">
        {groups.map((section, sectionIdx) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            {showText ? (
              <button
                type="button"
                onClick={() => toggleGroup(section.title)}
                className="mb-1.5 flex flex-row items-center justify-between px-3 text-[10px] font-semibold tracking-wider text-dashboard-sidebar-muted transition-colors hover:text-dashboard-sidebar-text focus:outline-none"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={cn("size-3.5 transition-transform duration-200", collapsedGroups[section.title] && "-rotate-90")}
                  strokeWidth={2.5}
                />
              </button>
            ) : sectionIdx > 0 ? (
              <div className="mx-auto mb-2 mt-1 h-px w-8 bg-dashboard-sidebar-border" aria-hidden />
            ) : null}

            <div className={cn("flex flex-col gap-0.5", collapsedGroups[section.title] && showText ? "hidden" : "block")}>
              {section.items.map((item) => {
                const active = isNavActive(pathname, item);
                const hasChildren = item.children && item.children.length > 0;
                const navBadge = item.href === chatPath ? chatUnreadTotal : 0;
                
                return (
                  <div key={item.href + item.label} className="flex flex-col">
                    <Link
                      href={item.href}
                      title={!showText ? item.label : undefined}
                      onClick={handleNav}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center rounded-xl py-2.5 text-[13px] font-medium transition-all',
                        showText ? 'gap-3 px-3' : 'justify-center px-2',
                        active && !hasChildren
                          ? 'bg-dashboard-sidebar-hover font-semibold text-white before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary'
                          : active && hasChildren
                            ? 'font-semibold text-white'
                            : 'text-dashboard-sidebar-muted hover:bg-dashboard-sidebar-hover/70 hover:text-white',
                      )}
                    >
                      <span className="relative shrink-0">
                        <item.icon
                          size={18}
                          strokeWidth={2}
                          className={cn(
                            active ? 'text-white' : 'text-dashboard-sidebar-muted group-hover:text-dashboard-sidebar-text',
                          )}
                        />
                        {!showText && navBadge > 0 ? (
                          <span className="absolute -right-1.5 -top-1.5 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                            {navBadge > 99 ? '99+' : navBadge}
                          </span>
                        ) : null}
                      </span>
                      {showText ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                      {showText && navBadge > 0 ? (
                        <span className="flex min-h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                          {navBadge > 99 ? '99+' : navBadge}
                        </span>
                      ) : null}
                      {showText && hasChildren && (
                        <ChevronDown 
                          className={cn("size-3.5 shrink-0 text-dashboard-sidebar-muted transition-transform duration-200", !active && "-rotate-90")} 
                        />
                      )}
                      {!showText && <span className={navTooltip}>{item.label}</span>}
                    </Link>
                    
                    {showText && hasChildren && active && (
                      <div className="relative mt-1 before:absolute before:bottom-1 before:left-[17px] before:top-1 before:w-px before:bg-dashboard-sidebar-border">
                        <div className="flex max-h-[min(42vh,280px)] flex-col gap-0.5 overflow-y-auto overscroll-contain pr-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/90 [&::-webkit-scrollbar-track]:bg-transparent">
                        {item.children!.map((child) => {
                          const childActive = child.exact 
                            ? pathname === child.href || pathname === `${child.href}/`
                            : pathname.startsWith(child.href);
                            
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={handleNav}
                              className={cn(
                                'relative rounded-xl py-2 pl-10 pr-3 text-xs font-medium transition-colors',
                                childActive
                                  ? 'bg-dashboard-sidebar-hover font-semibold text-white before:absolute before:left-[16px] before:top-[14px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary'
                                  : 'text-dashboard-sidebar-muted hover:bg-dashboard-sidebar-hover/50 hover:text-white',
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-dashboard-sidebar-border bg-dashboard-sidebar p-3">
        {showText ? (
          <div className="rounded-xl border border-dashboard-sidebar-border bg-dashboard-sidebar-hover/60 p-3">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashboard-sidebar-border bg-dashboard-sidebar">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-4 text-dashboard-sidebar-muted" strokeWidth={2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user?.fullName || 'Tài khoản'}</p>
                <p className="mt-0.5 truncate text-xs text-dashboard-sidebar-muted" title={user?.email}>
                  {user?.email || '—'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div className="group relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-dashboard-sidebar-border bg-dashboard-sidebar-hover">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-[18px] text-dashboard-sidebar-muted" strokeWidth={2} />
              )}
              <span
                className={cn(
                  navTooltip,
                  'w-max max-w-[min(240px,calc(100vw-5rem))] py-2 text-left',
                )}
              >
                <span className="block truncate font-semibold text-dashboard-ink">{user?.fullName || 'Tài khoản'}</span>
                <span className="mt-0.5 block truncate text-[11px] font-normal text-dashboard-muted">{user?.email || '—'}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const shellClass =
    'fixed inset-y-0 left-0 z-[70] flex flex-col overflow-visible border-r border-dashboard-sidebar-border bg-dashboard-sidebar transition-all duration-300 ease-in-out';

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
            className="fixed inset-0 z-[65] bg-dashboard-sidebar/40 backdrop-blur-[2px]"
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
