'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type PayoutPageShellProps = {
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  className?: string;
};

export function PayoutPageShell({
  action,
  backHref,
  backLabel = 'Quay lại',
  children,
  className,
}: PayoutPageShellProps) {
  const showToolbar = Boolean(backHref || action);

  return (
    <div className={cn('flex h-full min-h-0 w-full flex-1 flex-col bg-slate-50', className)}>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex min-h-full w-full flex-1 flex-col p-4 sm:p-6 lg:p-8">
          {showToolbar ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              {backHref ? (
                <Link
                  href={backHref}
                  aria-label={backLabel}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-primary"
                >
                  <ArrowLeft className="size-4" />
                </Link>
              ) : (
                <span />
              )}
              {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}

export function PayoutPanel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm',
        className,
      )}
    >
      {title ? (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn('min-h-0 flex-1 overflow-y-auto', bodyClassName)}>{children}</div>
    </section>
  );
}

export function PayoutBalanceHero({
  available,
  totalEarned,
  totalWithdrawn,
  locked,
}: {
  available: string;
  totalEarned: string;
  totalWithdrawn: string;
  locked: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[var(--color-dashboard-ink)] p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 size-48 rounded-full bg-white/5 blur-2xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Số dư khả dụng</p>
        <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">{available}</p>
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Thu nhập</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums">{totalEarned}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Đã rút</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums">{totalWithdrawn}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Đang khóa</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums">{locked}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function PayoutDetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function PayoutDetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-4 sm:p-5', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function PayoutEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="size-7" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
