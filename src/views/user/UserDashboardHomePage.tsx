'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileText, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/** Màu icon theo palette DESIGN.md (purple, green, orange; primary cho CTA-adjacent) */
const actions = [
  {
    href: '/mentors',
    title: 'Tìm Mentor',
    desc: 'Khám phá mentor phù hợp mục tiêu của bạn',
    icon: Sparkles,
    iconWrap: 'bg-purple-light text-secondary-purple',
  },
  {
    href: '/my-reports',
    title: 'Báo cáo của tôi',
    desc: 'Theo dõi và nộp báo cáo tiến độ',
    icon: FileText,
    iconWrap: 'bg-mint text-secondary-green',
  },
] as const;

export function UserDashboardHomePage() {
  const { user } = useAuth();
  const profileHref = user?.id != null ? `/profile/${user.id}` : '/profile';

  return (
    <div className="space-y-8">
      <section className="dashboard-content-card relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-gray">Học viên</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.12px] text-dark md:text-[28px] md:leading-tight">
            Xin chào{user?.fullName ? `, ${user.fullName}` : ''}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray">
            Bắt đầu từ đây — kết nối mentor, cập nhật hồ sơ và quản lý báo cáo trong một không gian gọn gàng.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group dashboard-stat-tile flex flex-col gap-4 p-6"
          >
            <div
              className={`flex size-12 items-center justify-center rounded-[8px] ${item.iconWrap}`}
            >
              <item.icon className="size-6" strokeWidth={2} />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-dark">
                {item.title}
                <ArrowUpRight className="size-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray">{item.desc}</p>
            </div>
          </Link>
        ))}

        <Link href={profileHref} className="group dashboard-stat-tile flex flex-col gap-4 p-6">
          <div className="flex size-12 items-center justify-center rounded-[8px] bg-badge-primary-bg text-primary">
            <UserRound className="size-6" strokeWidth={2} />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-dark">
              Hồ sơ cá nhân
              <ArrowUpRight className="size-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-gray">Chỉnh sửa thông tin hiển thị với mentor</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
