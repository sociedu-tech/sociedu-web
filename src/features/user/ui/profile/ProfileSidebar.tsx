import React from 'react';
import Link from 'next/link';
import { Star, Video, UserPlus } from 'lucide-react';
import type { User } from '@/types';
import type { ProfileRatingSummary } from '@/services/profileService';
import { ProfileVerificationBanner } from './ProfileVerificationBanner';
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
    <aside className="space-y-4 lg:sticky lg:top-24">
      {isMentor ? (
        <ProfileVerificationBanner
          user={user}
          isMentor={isMentor}
          isOwnProfile={isOwnProfile}
          className="lg:hidden"
        />
      ) : null}

      {canBook && !isOwnProfile ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <p className="text-sm font-semibold text-indigo-900">Sẵn sàng đồng hành?</p>
          <p className="mt-1 text-xs leading-relaxed text-indigo-800/90">
            Mentor đã xác thực — đặt gói và thanh toán qua VNPay.
          </p>
          <button
            type="button"
            onClick={onConnect}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <UserPlus className="size-4" />
            Đặt lịch ngay
          </button>
          <Link
            href={`/profile/${mentorId}/book`}
            className="mt-2 block text-center text-xs font-medium text-indigo-700 hover:underline"
          >
            Xem trang đặt lịch
          </Link>
        </div>
      ) : null}

      {isMentor && verified && info ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Thống kê</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Đánh giá</dt>
              <dd className="flex items-center gap-1 font-semibold text-slate-900">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {ratingSummary.ratingAvg.toFixed(1)}
                <span className="font-normal text-slate-400">({ratingSummary.ratingCount})</span>
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Buổi đã hoàn thành</dt>
              <dd className="font-semibold text-slate-900">{info.sessionsCompleted ?? 0}</dd>
            </div>
            {info.price > 0 ? (
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Giá từ</dt>
                <dd className="font-semibold text-indigo-700">
                  {info.price.toLocaleString('vi-VN')}đ
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : !isMentor ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tổng quan</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Vai trò</dt>
              <dd className="font-semibold text-slate-900">Học viên</dd>
            </div>
            {user.university ? (
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Trường</dt>
                <dd className="max-w-[55%] text-right font-medium text-slate-800">
                  {user.university}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

      {!isOwnProfile ? (
        <button
          type="button"
          onClick={onReport}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:text-red-600"
        >
          Báo cáo vi phạm
        </button>
      ) : null}

      {verified ? (
        <p className="flex items-center gap-2 px-1 text-xs text-slate-400">
          <Video className="size-3.5 shrink-0" />
          Buổi học được quản lý sau khi thanh toán thành công.
        </p>
      ) : null}
    </aside>
  );
}
