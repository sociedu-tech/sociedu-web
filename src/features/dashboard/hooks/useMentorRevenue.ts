'use client';

import { useCallback, useEffect, useState } from 'react';
import { payoutService } from '@/services/payoutService';
import { formatViDateTime } from '@/lib/apiUtils';
import { asMoney } from '@/features/finance/lib/payoutUi';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';

export function useMentorRevenue() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [transactions, setTransactions] = useState<MentorOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const finance = await payoutService.getFinanceSnapshot();
      setWalletBalance(finance.walletBalance);
      setTotalRevenue(finance.totalRevenue);
      setTransactions(
        finance.payouts.map((p) => ({
          id: String(p.id),
          buyerId: null,
          mentee: '',
          package: 'Rút tiền',
          amount: -asMoney(p.grossAmount),
          date: formatViDateTime(p.createdAt),
          sortAt: p.createdAt ?? '',
          paidAt: p.createdAt ?? null,
          rawStatus: String(p.status ?? ''),
          status: String(p.status ?? 'Đang xử lý'),
          type: 'withdrawal' as const,
          bank: p.bankName ?? undefined,
        })),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không tải được doanh thu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { walletBalance, totalRevenue, transactions, loading, error, refresh: load };
}
