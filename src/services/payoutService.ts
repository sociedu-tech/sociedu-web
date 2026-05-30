import { api } from '@/lib/api';
import { unwrapList, unwrapPage } from '@/lib/apiUtils';

const BASE = '/api/v1/mentors/me';

export type RevenueSummary = {
  totalEarned?: number | string;
  totalWithdrawn?: number | string;
  lockedBalance?: number | string;
  availableBalance?: number | string;
};

export type PayoutRequest = {
  id: string;
  amount?: number | string;
  status?: string;
  createdAt?: string;
  bankAccountMasked?: string | null;
};

const asNumber = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export const payoutService = {
  getRevenueSummary: async (): Promise<RevenueSummary> => {
    const res = await api.get(`${BASE}/revenue-summary`);
    return (res.data as RevenueSummary | undefined) ?? {};
  },

  listPayouts: async (page = 0, size = 50): Promise<PayoutRequest[]> => {
    const res = await api.get(`${BASE}/payouts?page=${page}&size=${size}`);
    const { items } = unwrapPage<PayoutRequest>(res.data);
    return items;
  },

  /** Gộp doanh thu + payouts cho UI dashboard mentor. */
  getFinanceSnapshot: async () => {
    const [summary, payouts] = await Promise.all([
      payoutService.getRevenueSummary(),
      payoutService.listPayouts(),
    ]);

    return {
      walletBalance: asNumber(summary.availableBalance),
      totalRevenue: asNumber(summary.totalEarned),
      totalWithdrawn: asNumber(summary.totalWithdrawn),
      lockedBalance: asNumber(summary.lockedBalance),
      payouts,
    };
  },
};
