import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  MapPin,
  MessageCircle,
  Pencil,
  Star,
  UserPlus,
} from 'lucide-react';
import type { User as UserType } from '@/types';
import type { ProfileRatingSummary } from '@/services/profileService';
import { getMentorVerificationStatus, isMentorVerified, verificationCopy } from './profileVerification';
import { ProfileVerificationBadge } from './ProfileVerificationBadge';

interface ProfileHeaderProps {
  user: UserType;
  isOwnProfile: boolean;
  isMentor: boolean;
  ratingSummary: ProfileRatingSummary;
  onConnect: () => void;
  onMessage: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  isMentor,
  ratingSummary,
  onConnect,
  onMessage,
}: ProfileHeaderProps) {
  const verified = isMentor && isMentorVerified(user);
  const verificationStatus = isMentor ? getMentorVerificationStatus(user) : null;
  const expertise = user.mentorInfo?.expertise ?? [];
  const canBook = isMentor && (isOwnProfile || verified);

  const subtitle =
    user.mentorInfo?.headline?.trim() ||
    (user.major && user.university ? `${user.major} · ${user.university}` : null);

  return (
    <header className="relative overflow-hidden border-b border-marketing-border bg-white">
      <div
        className="absolute inset-0 bg-linear-to-br from-marketing-chrome via-indigo-950 to-indigo-800"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />

      <div className="relative w-full px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
        <Link
          href={isMentor ? '/mentors' : '/dashboard'}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {isMentor ? 'Danh sách mentor' : 'Bảng điều khiển'}
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <div className="size-28 overflow-hidden rounded-2xl border-4 border-white/95 bg-marketing-avatar-from shadow-lg ring-4 ring-white/20 sm:size-32">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="size-full object-cover"
                  unoptimized
                  priority
                />
              </div>
              {verified ? (
                <span
                  className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow"
                  title="Đã xác thực"
                >
                  ✓
                </span>
              ) : null}
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {user.name}
                </h1>
                {isMentor && verificationStatus ? (
                  <ProfileVerificationBadge status={verificationStatus} size="md" />
                ) : null}
              </div>

              {isMentor && verificationStatus && verificationStatus !== 'verified' ? (
                <p className="mt-2 text-sm font-medium text-amber-200">
                  {verificationCopy[verificationStatus].description}
                </p>
              ) : subtitle ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {subtitle}
                </p>
              ) : (
                <p className="mt-2 text-sm text-white/70">
                  {isMentor ? 'Mentor Mentoree' : 'Thành viên Mentoree'}
                </p>
              )}

              <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {user.location ? (
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                    <MapPin className="size-3.5" aria-hidden />
                    {user.location}
                  </li>
                ) : null}
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                  <Calendar className="size-3.5" aria-hidden />
                  Tham gia {user.joinedDate}
                </li>
                {isMentor && ratingSummary.ratingCount > 0 ? (
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1.5 text-xs font-semibold text-amber-100 ring-1 ring-amber-300/30">
                    <Star className="size-3.5 fill-amber-300 text-amber-300" aria-hidden />
                    {ratingSummary.ratingAvg.toFixed(1)} ({ratingSummary.ratingCount})
                  </li>
                ) : null}
                {!isMentor && user.university ? (
                  <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                    {user.university}
                  </li>
                ) : null}
              </ul>

              {verified && expertise.length > 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {expertise.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {expertise.length > 5 ? (
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white/80">
                      +{expertise.length - 5}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:min-w-[220px]">
            {isOwnProfile ? (
              <Link
                href="/dashboard/profile/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-marketing-chrome shadow-md transition hover:bg-white/95"
              >
                <Pencil className="size-4" aria-hidden />
                Chỉnh sửa hồ sơ
              </Link>
            ) : (
              <>
                {canBook ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
                  >
                    <UserPlus className="size-4" aria-hidden />
                    Đặt lịch / Kết nối
                  </button>
                ) : isMentor ? (
                  <p className="rounded-xl border border-amber-300/40 bg-amber-500/20 px-4 py-3 text-center text-xs font-medium text-amber-50">
                    Chỉ đặt lịch khi mentor đã xác thực
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Nhắn tin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
