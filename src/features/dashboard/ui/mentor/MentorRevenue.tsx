'use client';

import React from 'react';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History,
  Filter,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useMentorRevenue } from '@/features/dashboard/hooks/useMentorRevenue';
import { useMentorOrders } from '@/features/dashboard/hooks/useMentorOrders';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';

const statGridClass = (compact: boolean) =>
  cn(
    'grid gap-4',
    compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  );

type MentorRevenueProps = {
  embedded?: boolean;
  showStatCards?: boolean;
  showTransactions?: boolean;
  compactStats?: boolean;
  showTransactionsHeading?: boolean;
};

export function MentorRevenueToolbar() {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Filter size={16} /> Bộ lọc
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Download size={16} /> Xuất báo cáo
      </button>
    </div>
  );
}

export function MentorRevenue({
  embedded = false,
  showStatCards = true,
  showTransactions = true,
  compactStats = false,
  showTransactionsHeading = true,
}: MentorRevenueProps) {
  const { walletBalance, totalRevenue, transactions: payouts, loading, error, refresh } = useMentorRevenue();
  const { orders, loading: ordersLoading } = useMentorOrders();

  const transactions: MentorOrderRow[] = [
    ...orders,
    ...payouts,
  ].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));

  if (loading || ordersLoading) {
    return <PageLoadingState label="Đang tải doanh thu…" variant="stats" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  const fmt = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

  return (
    <div className="space-y-6">
      {!embedded ? (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-dark">Thống kê Doanh thu</h2>
          <MentorRevenueToolbar />
        </div>
      ) : null}

      {showStatCards ? (
        <div className={statGridClass(compactStats)}>
          <div className="bg-primary p-6 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Wallet size={20} />
              </div>
              <p className="text-xs font-semibold tracking-wider text-primary-50 opacity-90 mb-1">Số dư khả dụng</p>
              <h3 className="text-2xl font-bold">{fmt(walletBalance)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={20} />
              </div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Tổng thu nhập</p>
              <h3 className="text-2xl font-bold text-dark">{fmt(totalRevenue)}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <CreditCard size={20} />
              </div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Đơn hàng</p>
              <h3 className="text-2xl font-bold text-dark">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <History size={20} />
              </div>
              <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Yêu cầu rút</p>
              <h3 className="text-2xl font-bold text-dark">{payouts.length}</h3>
            </div>
          </div>
        </div>
      ) : null}

      {showTransactions ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          {showTransactionsHeading ? (
            <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-dark">
              <History className="text-gray-400" size={18} /> Lịch sử giao dịch gần đây
            </h3>
          ) : null}

          {transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Chưa có giao dịch.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 group transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center border',
                        tx.type === 'withdrawal'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-green-50 text-green-600 border-green-100',
                      )}
                    >
                      {tx.type === 'withdrawal' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-dark text-sm">
                        {tx.type === 'withdrawal' ? `Rút tiền${tx.bank ? `: ${tx.bank}` : ''}` : tx.mentee}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {tx.type === 'withdrawal' ? 'Yêu cầu rút tiền' : tx.package}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-sm font-bold',
                        tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600',
                      )}
                    >
                      {tx.type === 'withdrawal' ? '' : '+'}
                      {tx.amount.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
