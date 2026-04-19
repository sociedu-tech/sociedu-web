'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Package,
  RefreshCw,
  UserCheck,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPrimitives';
import { useAdminSectionData } from '@/components/admin/AdminDataContext';
import { ADMIN_PAGE_TITLES, ADMIN_PATHS } from '@/components/admin/adminPaths';

function normalizePath(p: string) {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() || '');
  const { loading, error, refresh, data } = useAdminSectionData();

  const title = ADMIN_PAGE_TITLES[pathname] ?? 'Quản trị hệ thống';

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <LoadingSpinner size={48} label="Đang tải…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <ErrorMessage message={error} onRetry={refresh} />
      </div>
    );
  }

  const navItems: {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { href: ADMIN_PATHS.stats, label: 'Thống kê', icon: <BarChart3 size={18} /> },
    {
      href: ADMIN_PATHS.mentorRequests,
      label: 'Yêu cầu mentor',
      icon: <UserCheck size={18} />,
      badge: data.mentorRequests.length,
    },
    {
      href: ADMIN_PATHS.productRequests,
      label: 'Đăng tài liệu',
      icon: <Package size={18} />,
      badge: data.productRequests.length,
    },
    {
      href: ADMIN_PATHS.updateRequests,
      label: 'Cập nhật tài liệu',
      icon: <RefreshCw size={18} />,
      badge: data.updateRequests.length,
    },
    { href: ADMIN_PATHS.users, label: 'Người dùng', icon: <Users size={18} /> },
  ];

  return (
    <div className="pb-4">
      <DashboardPageHeader title="Quản trị hệ thống" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Mục quản trị">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex min-w-[140px] shrink-0 items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors lg:min-w-0 lg:w-full',
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={active ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                    {item.label}
                  </span>
                  {item.badge != null && item.badge > 0 ? (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-9">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            </div>
            <div className="overflow-x-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
