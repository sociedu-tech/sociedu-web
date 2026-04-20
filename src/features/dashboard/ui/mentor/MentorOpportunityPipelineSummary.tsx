'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Inbox, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENTOR_OPPORTUNITY_BASE_COUNTS } from '@/data/mentorOpportunitiesMock';

type PipelineSummaryProps = {
  /** Số gợi ý đang mở (có thể truyền động; mặc định từ mock). */
  suggestedOpen?: number;
  /** Số yêu cầu học viên đang mở. */
  requestsOpen?: number;
  /** `home`: 2 thẻ + CTA; `inline`: chỉ số liệu nhỏ trong hero. */
  variant?: 'home' | 'inline';
  className?: string;
};

export function MentorOpportunityPipelineSummary({
  suggestedOpen = MENTOR_OPPORTUNITY_BASE_COUNTS.suggested,
  requestsOpen = MENTOR_OPPORTUNITY_BASE_COUNTS.requests,
  variant = 'home',
  className,
}: PipelineSummaryProps) {
  const total = suggestedOpen + requestsOpen;

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap gap-3 text-sm text-slate-600', className)}>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 font-medium text-indigo-900">
          <Sparkles className="size-3.5 text-indigo-600" strokeWidth={2} />
          {suggestedOpen} gợi ý
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-medium text-amber-950">
          <Inbox className="size-3.5 text-amber-700" strokeWidth={2} />
          {requestsOpen} yêu cầu
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50/90 to-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="mb-4 flex justify-end">
        <Link
          href="/dashboard/opportunities"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Quản lý chi tiết
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
            <Sparkles className="size-3.5" strokeWidth={2} />
            Gợi ý mở
          </div>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">{suggestedOpen}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
            <Inbox className="size-3.5" strokeWidth={2} />
            Yêu cầu
          </div>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">{requestsOpen}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <Layers className="size-3.5" strokeWidth={2} />
            Tổng cần xem
          </div>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">{total}</p>
          <p className="mt-1 text-[11px] text-slate-500">Gợi ý + yêu cầu (demo)</p>
        </div>
      </div>
    </div>
  );
}
