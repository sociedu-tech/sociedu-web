'use client';

import { BadgeCheck, Clock, ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { verificationCopy, type MentorVerificationUi } from './profileVerification';

type Props = {
  status: MentorVerificationUi;
  size?: 'sm' | 'md';
  className?: string;
};

export function ProfileVerificationBadge({ status, size = 'sm', className }: Props) {
  const copy = verificationCopy[status];
  const Icon =
    status === 'verified' ? BadgeCheck : status === 'rejected' ? ShieldOff : Clock;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold ring-1',
        size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs',
        status === 'verified' && 'bg-emerald-600 text-white ring-emerald-700/30',
        status === 'pending' && 'bg-amber-500 text-white ring-amber-600/30',
        status === 'rejected' && 'bg-red-600 text-white ring-red-700/30',
        status === 'unknown' && 'bg-slate-500 text-white ring-slate-600/30',
        className,
      )}
    >
      <Icon className={size === 'md' ? 'size-4' : 'size-3.5'} strokeWidth={2.5} aria-hidden />
      {copy.label}
    </span>
  );
}
