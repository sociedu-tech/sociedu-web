import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
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

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="h-28 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-900 sm:h-36" />
      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative mx-auto sm:mx-0">
              <div className="size-28 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md sm:size-32">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="size-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="text-center sm:pb-1 sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {user.name}
                </h1>
                {isMentor && verificationStatus ? (
                  <ProfileVerificationBadge status={verificationStatus} size="md" />
                ) : null}
              </div>

              {isMentor && verificationStatus && verificationStatus !== 'verified' ? (
                <p className="mt-2 text-sm font-medium text-amber-800">
                  {verificationCopy[verificationStatus].description}
                </p>
              ) : (
                <p className="mt-1 max-w-xl text-sm text-slate-600 sm:text-base">
                  {user.mentorInfo?.headline?.trim() ||
                    (user.major && user.university
                      ? `${user.major} · ${user.university}`
                      : isMentor
                        ? 'Mentor Mentoree'
                        : 'Thành viên Mentoree')}
                </p>
              )}

              {verified || !isMentor ? (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500 sm:justify-start">
                  {user.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-indigo-500" />
                      {user.location}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4 text-indigo-500" />
                    Tham gia {user.joinedDate}
                  </span>
                  {isMentor && ratingSummary.ratingCount > 0 ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      {ratingSummary.ratingAvg.toFixed(1)} ({ratingSummary.ratingCount} đánh giá)
                    </span>
                  ) : null}
                </div>
              ) : null}

              {verified && expertise.length > 0 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {expertise.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {verified && user.mentorInfo?.headline?.trim() ? (
                <p className="mt-3 max-w-xl text-sm text-slate-600">{user.mentorInfo.headline}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:min-w-[200px]">
            {isOwnProfile ? (
              <Link
                href="/dashboard/profile/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Pencil className="size-4" />
                Chỉnh sửa hồ sơ
              </Link>
            ) : (
              <>
                {canBook ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <UserPlus className="size-4" />
                    Đặt lịch / Kết nối
                  </button>
                ) : isMentor ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-medium text-amber-900">
                    Chỉ đặt lịch khi mentor đã xác thực
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <MessageCircle className="size-4" />
                  Nhắn tin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
