'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, Package, BarChart3, ArrowLeft } from 'lucide-react';

export default function AdminMentorDetailLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ mentorId: string }>;
}) {
  const params = use(paramsPromise);
  const pathname = usePathname();
  const mentorId = params.mentorId;

  const tabs = [
    { href: `/dashboard/mentors/${mentorId}`, label: 'Tổng quan', icon: BarChart3, exact: true },
    { href: `/dashboard/mentors/${mentorId}/packages`, label: 'Gói dịch vụ', icon: Package },
    { href: `/dashboard/mentors/${mentorId}/mentees`, label: 'Học viên', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/mentors"
          className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chi tiết Mentor</h2>
          <p className="text-sm text-slate-500">ID: {mentorId}</p>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                active ? "text-primary" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon size={16} strokeWidth={2} />
              {tab.label}
              {active && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  style={{ marginBottom: '-1px' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
