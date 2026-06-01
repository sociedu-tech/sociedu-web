'use client';

import Link from 'next/link';
import {
  CalendarRange,
  CheckCircle2,
  Flag,
  Loader2,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingProgramItem } from '@/features/dashboard/types/booking';
import { sessionStatusBadgeClass } from '@/features/dashboard/lib/sessionStatusUi';

type ActionProps = {
  orderHref: string | null;
  reportHref: string | null;
  showReport: boolean;
  showChat: boolean;
  chatAction?: string;
  chatDisabled: boolean;
  messaging: boolean;
  onMessage: () => void;
};

export function ProgramDetailOverview({
  item,
  packageName,
  counterpartyLabel,
  labels,
  actions,
}: {
  item: BookingProgramItem;
  packageName: string;
  counterpartyLabel: string;
  labels: { counterparty: string; progress: string };
  actions: ActionProps;
}) {
  const progress = Math.min(100, Math.max(0, item.progressPercent));
  const total = item.totalSessions || 0;
  const completed = item.completedSessions;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-indigo-500" aria-hidden />

      <div className="p-5 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(240px,320px)] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary">
                <Sparkles className="size-3.5" aria-hidden />
                Gói mentoring
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{packageName}</h1>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary shadow-sm">
                    {counterpartyLabel.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    {labels.counterparty}: <strong className="font-semibold text-slate-900">{counterpartyLabel}</strong>
                  </span>
                </span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                    sessionStatusBadgeClass(item.bookingStatus),
                  )}
                >
                  {item.bookingStatusLabel}
                </span>
              </div>
            </div>

            <ProgramDetailActions {...actions} />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5 shadow-inner">
            <p className="text-xs font-semibold tracking-wide text-slate-500">{labels.progress}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <span className="text-4xl font-bold tabular-nums tracking-tight text-primary">{progress}%</span>
              <span className="pb-1 text-sm text-slate-600">
                <CheckCircle2 className="mr-1 inline size-4 text-emerald-500" aria-hidden />
                {completed}/{total || '—'} buổi
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-4 text-sm">
              <MetaItem icon={CalendarRange} label="Bắt đầu" value={item.startAt} />
              <MetaItem icon={CalendarRange} label="Kết thúc" value={item.endAt} />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-2xs font-semibold tracking-wide text-slate-400">
        <Icon className="size-3" aria-hidden />
        {label}
      </dt>
      <dd className="mt-0.5 truncate font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function ProgramDetailActions({
  orderHref,
  reportHref,
  showReport,
  showChat,
  chatAction,
  chatDisabled,
  messaging,
  onMessage,
}: ActionProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {orderHref ? (
        <Link
          href={orderHref}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ShoppingBag className="size-4 text-slate-500" aria-hidden />
          Đơn hàng
        </Link>
      ) : null}
      {showReport && reportHref ? (
        <Link
          href={reportHref}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100"
        >
          <Flag className="size-4" aria-hidden />
          Báo cáo vi phạm
        </Link>
      ) : null}
      {showChat && chatAction ? (
        <button
          type="button"
          disabled={chatDisabled}
          onClick={onMessage}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {messaging ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
          {chatAction}
        </button>
      ) : null}
    </div>
  );
}

export function ProgramDetailSidebar({
  item,
  sessionStats,
  orphanReportCount,
}: {
  item: BookingProgramItem;
  sessionStats: { label: string; count: number; tone: string }[];
  orphanReportCount: number;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Tổng quan buổi học</h3>
        {sessionStats.length > 0 ? (
          <ul className="mt-4 space-y-2.5">
            {sessionStats.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={cn('size-2 rounded-full', row.tone)} aria-hidden />
                  {row.label}
                </span>
                <span className="font-semibold tabular-nums text-slate-900">{row.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Chưa có buổi học để thống kê.</p>
        )}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Tổng buổi</span>
            <span className="font-semibold text-slate-900">{item.sessionRows.length || item.totalSessions || 0}</span>
          </div>
          {orphanReportCount > 0 ? (
            <p className="mt-2 text-xs text-amber-700">
              {orphanReportCount} báo cáo chưa gắn buổi cụ thể
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-600">
        <User className="mb-2 size-4 text-slate-400" aria-hidden />
        Theo dõi tiến độ từng buổi, cập nhật lịch và xác nhận hoàn thành để gói học được ghi nhận đúng.
      </div>
    </aside>
  );
}
