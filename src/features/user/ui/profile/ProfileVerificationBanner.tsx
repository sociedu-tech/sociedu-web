'use client';

import React from 'react';
import Link from 'next/link';
import { BadgeCheck, Clock, ShieldAlert, ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import {
  getMentorVerificationStatus,
  isMentorVerified,
  verificationCopy,
  type MentorVerificationUi,
} from './profileVerification';

type Props = {
  user: User;
  isMentor: boolean;
  isOwnProfile: boolean;
  className?: string;
};

const toneStyles: Record<
  MentorVerificationUi,
  { wrap: string; icon: string; Icon: typeof BadgeCheck }
> = {
  verified: {
    wrap: 'border-emerald-200 bg-emerald-50/90',
    icon: 'text-emerald-600',
    Icon: BadgeCheck,
  },
  pending: {
    wrap: 'border-amber-200 bg-amber-50/90',
    icon: 'text-amber-600',
    Icon: Clock,
  },
  rejected: {
    wrap: 'border-red-200 bg-red-50/90',
    icon: 'text-red-600',
    Icon: ShieldOff,
  },
  unknown: {
    wrap: 'border-slate-200 bg-slate-50',
    icon: 'text-slate-500',
    Icon: ShieldAlert,
  },
};

export function ProfileVerificationBanner({ user, isMentor, isOwnProfile, className }: Props) {
  if (!isMentor) return null;

  const status = getMentorVerificationStatus(user);
  const copy = verificationCopy[status];
  const styles = toneStyles[status];
  const Icon = styles.Icon;
  const verified = isMentorVerified(user);

  return (
    <section
      className={cn(
        'rounded-2xl border p-4 sm:p-5',
        styles.wrap,
        className,
      )}
      aria-label="Trạng thái xác thực mentor"
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm',
            styles.icon,
          )}
        >
          <Icon className="size-6" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-slate-600">
              Xác thực mentor
            </span>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-bold',
                verified
                  ? 'bg-emerald-600 text-white'
                  : status === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-white',
              )}
            >
              {copy.label}
            </span>
          </div>
          <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">{copy.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{copy.description}</p>
          {isOwnProfile && status === 'pending' ? (
            <Link
              href="/dashboard/packages"
              className="mt-3 inline-flex text-sm font-semibold text-indigo-700 hover:underline"
            >
              Hoàn thiện hồ sơ & gói dịch vụ →
            </Link>
          ) : null}
          {isOwnProfile && status === 'rejected' ? (
            <Link
              href="/dashboard/profile/edit"
              className="mt-3 inline-flex text-sm font-semibold text-indigo-700 hover:underline"
            >
              Cập nhật hồ sơ →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
