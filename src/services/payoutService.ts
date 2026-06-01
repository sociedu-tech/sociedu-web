import { api } from '@/lib/api';
import { normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import { asMoney } from '@/features/finance/lib/payoutUi';

const BASE = '/api/v1/mentors/me';

export type RevenueSummary = {
  totalEarned?: number | string;
  totalWithdrawn?: number | string;
  lockedBalance?: number | string;
  availableBalance?: number | string;
};

export type PayoutRequestDto = {
  id: string;
  mentorId?: string;
  grossAmount?: number | string;
  netAmount?: number | string;
  platformFeeRate?: number | string;
  status?: string;
  bankName?: string;
  accountNumber?: string | null;
  accountHolder?: string;
  rejectReason?: string | null;
  failureReason?: string | null;
  transactionReference?: string | null;
  createdAt?: string;
  updatedAt?: string;
  processedAt?: string | null;
};

export type CreatePayoutBody = {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type FinanceSnapshot = {
  walletBalance: number;
  totalRevenue: number;
  totalWithdrawn: number;
  lockedBalance: number;
  payouts: PayoutRequestDto[];
};

export const payoutService = {
  getRevenueSummary: async (): Promise<RevenueSummary> => {
    const res = await api.get(`${BASE}/revenue-summary`);
    return (res.data as RevenueSummary | undefined) ?? {};
  },

  listPayouts: async (page = 0, size = 20): Promise<PagePayload<PayoutRequestDto>> => {
    const res = await api.get(`${BASE}/payouts?page=${page}&size=${size}`);
    return normalizePagePayload<PayoutRequestDto>(res.data, size);
  },

  getPayout: async (id: string): Promise<PayoutRequestDto> => {
    const res = await api.get(`${BASE}/payouts/${id}`);
    return res.data as PayoutRequestDto;
  },

  createPayout: async (body: CreatePayoutBody): Promise<PayoutRequestDto> => {
    const res = await api.post(`${BASE}/payouts`, body);
    return res.data as PayoutRequestDto;
  },

  getFinanceSnapshot: async (payoutSize = 10): Promise<FinanceSnapshot> => {
    const [summary, payoutsPage] = await Promise.all([
      payoutService.getRevenueSummary(),
      payoutService.listPayouts(0, payoutSize),
    ]);

    return {
      walletBalance: asMoney(summary.availableBalance),
      totalRevenue: asMoney(summary.totalEarned),
      totalWithdrawn: asMoney(summary.totalWithdrawn),
      lockedBalance: asMoney(summary.lockedBalance),
      payouts: payoutsPage.items,
    };
  },
};
