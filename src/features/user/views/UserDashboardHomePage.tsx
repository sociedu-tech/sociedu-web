'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DashboardPage,
  DashboardSection,
  DashboardViewHeader,
} from '@/features/dashboard/ui/modules';
import { MenteeOverviewCharts } from '@/features/dashboard/ui/overview/MenteeOverviewCharts';

const QUICK_LINKS = [
  { href: '/dashboard/mentoring', label: 'Mentoring', desc: 'Chương trình học', icon: BookOpen },
  { href: '/dashboard/my-orders', label: 'Đơn hàng', desc: 'Lịch sử mua', icon: ShoppingBag },
  { href: '/dashboard/sessions', label: 'Lịch học', desc: 'Buổi học sắp tới', icon: Calendar },
  { href: '/dashboard/find-mentors', label: 'Tìm mentor', desc: 'Khám phá mentor', icon: Search },
] as const;

export function UserDashboardHomePage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0];

  return (
    <DashboardPage spacing="relaxed">
      <DashboardViewHeader
        layout="featured"
        eyebrow="Không gian học tập"
        title={firstName ? `Xin chào, ${firstName}` : 'Bảng điều khiển'}
        description="Theo dõi tiến độ mentoring, đơn hàng và lịch học của bạn."
      />

      <DashboardSection title="Truy cập nhanh">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-3 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 shadow-[var(--shadow-dashboard-card)] transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <item.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-dashboard-ink">{item.label}</span>
                <span className="mt-0.5 block text-xs text-dashboard-muted">{item.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Tiến độ học tập" description="Thống kê mentoring và buổi học">
        <MenteeOverviewCharts />
      </DashboardSection>
    </DashboardPage>
  );
}
