'use client';

import Link from 'next/link';
import { ArrowRight, CreditCard, History, TrendingUp, Wallet } from 'lucide-react';
import type { FinanceSnapshot } from '@/services/payoutService';
import { formatVnd } from '@/features/finance/lib/payoutUi';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';

type Props = {
  finance: FinanceSnapshot;
  payoutCount?: number;
  orderCount?: number;
};

export function MentorFinanceKpiGrid({ finance, payoutCount, orderCount }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsKpiCard
        label="Số dư khả dụng"
        value={formatVnd(finance.walletBalance)}
        hint="Có thể rút ngay"
        icon={Wallet}
        tone="featured"
      />
      <StatsKpiCard
        label="Tổng thu nhập"
        value={formatVnd(finance.totalRevenue)}
        icon={TrendingUp}
      />
      <StatsKpiCard
        label="Đã rút"
        value={formatVnd(finance.totalWithdrawn)}
        icon={CreditCard}
      />
      <StatsKpiCard
        label="Yêu cầu rút"
        value={payoutCount ?? finance.payouts.length}
        hint={orderCount != null ? `${orderCount} đơn hàng` : undefined}
        icon={History}
      />
    </div>
  );
}

export function MentorFinanceQuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/dashboard/payouts/new"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
      >
        Rút tiền
        <ArrowRight className="size-4" />
      </Link>
      <Link
        href="/dashboard/payouts"
        className="inline-flex items-center gap-2 rounded-xl border border-dashboard-border bg-dashboard-surface px-4 py-2.5 text-sm font-semibold text-dashboard-ink-secondary transition hover:bg-dashboard-canvas"
      >
        Lịch sử rút tiền
      </Link>
    </div>
  );
}
