import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Shield,
  Star,
  UserPlus,
  Video,
  Wallet,
} from 'lucide-react';
import type { User } from '@/types';
import type { ProfileRatingSummary } from '@/services/profileService';
import { isMentorVerified } from './profileVerification';

type Props = {
  user: User;
  isMentor: boolean;
  isOwnProfile: boolean;
  mentorId: string;
  ratingSummary: ProfileRatingSummary;
  onConnect: () => void;
  onReport: () => void;
};

function SidebarCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-marketing-card-border bg-white p-5 shadow-sm ${className}`}
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-marketing-fg-muted">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ProfileSidebar({
  user,
  isMentor,
  isOwnProfile,
  mentorId,
  ratingSummary,
  onConnect,
  onReport,
}: Props) {
  const info = user.mentorInfo;
  const verified = isMentor && isMentorVerified(user);
  const canBook = isMentor && (isOwnProfile || verified);

  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      {canBook && !isOwnProfile ? (
        <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-600 to-indigo-800 p-5 text-white shadow-md">
          <p className="text-sm font-bold">Sẵn sàng đồng hành?</p>
          <p className="mt-1.5 text-xs leading-relaxed text-indigo-100">
            Mentor đã xác thực — chọn gói và thanh toán an toàn qua VNPay.
          </p>
          <button
            type="button"
            onClick={onConnect}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50"
          >
            <UserPlus className="size-4" aria-hidden />
            Đặt lịch ngay
          </button>
          <Link
            href={`/profile/${mentorId}/book`}
            className="mt-3 block text-center text-xs font-semibold text-indigo-200 hover:text-white"
          >
            Xem trang đặt lịch →
          </Link>
        </div>
      ) : null}

      {isMentor && verified && info ? (
        <SidebarCard title="Thống kê mentor">
          <dl className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-marketing-fg-muted">
                <Star className="size-4 text-amber-500" aria-hidden />
                Đánh giá
              </dt>
              <dd className="font-bold text-marketing-fg">
                {ratingSummary.ratingAvg.toFixed(1)}
                <span className="ml-1 font-normal text-marketing-fg-subtle">
                  ({ratingSummary.ratingCount})
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-marketing-fg-muted">
                <BookOpen className="size-4 text-indigo-500" aria-hidden />
                Buổi hoàn thành
              </dt>
              <dd className="font-bold text-marketing-fg">{info.sessionsCompleted ?? 0}</dd>
            </div>
            {info.price > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-marketing-fg-muted">
                  <Wallet className="size-4 text-emerald-600" aria-hidden />
                  Giá từ
                </dt>
                <dd className="font-bold text-indigo-700">
                  {info.price.toLocaleString('vi-VN')}đ
                </dd>
              </div>
            ) : null}
          </dl>
        </SidebarCard>
      ) : !isMentor ? (
        <SidebarCard title="Tổng quan">
          <dl className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-marketing-fg-muted">
                <Shield className="size-4" aria-hidden />
                Vai trò
              </dt>
              <dd className="font-bold text-marketing-fg">Học viên</dd>
            </div>
            {user.university ? (
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-marketing-fg-muted">
                  <GraduationCap className="size-4 shrink-0" aria-hidden />
                  Trường
                </dt>
                <dd className="max-w-[58%] text-right font-medium text-marketing-fg-strong">
                  {user.university}
                </dd>
              </div>
            ) : null}
            {user.major ? (
              <div className="flex items-start justify-between gap-3">
                <dt className="text-marketing-fg-muted">Chuyên ngành</dt>
                <dd className="max-w-[58%] text-right font-medium text-marketing-fg-strong">
                  {user.major}
                </dd>
              </div>
            ) : null}
          </dl>
        </SidebarCard>
      ) : null}

      {!isOwnProfile ? (
        <button
          type="button"
          onClick={onReport}
          className="w-full rounded-xl border border-marketing-border py-2.5 text-sm font-medium text-marketing-fg-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Báo cáo vi phạm
        </button>
      ) : null}

      {verified ? (
        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-marketing-fg-subtle">
          <Video className="mt-0.5 size-4 shrink-0 text-indigo-500" aria-hidden />
          Buổi học được quản lý sau khi thanh toán thành công.
        </p>
      ) : null}
    </aside>
  );
}
