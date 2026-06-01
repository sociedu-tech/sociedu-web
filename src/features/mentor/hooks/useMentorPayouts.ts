'use client';

import { useCallback, useEffect, useState } from 'react';
import { payoutService, type FinanceSnapshot, type PayoutRequestDto } from '@/services/payoutService';

export function useMentorPayouts(page = 0, size = 20) {
  const [items, setItems] = useState<PayoutRequestDto[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageData = await payoutService.listPayouts(page, size);
      setItems(pageData.items);
      setTotalElements(pageData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách rút tiền.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, totalElements, loading, error, refresh: load };
}

export function useMentorFinanceSummary() {
  const [finance, setFinance] = useState<FinanceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFinance(await payoutService.getFinanceSnapshot(10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được số dư.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { finance, loading, error, refresh: load };
}

export function useMentorPayoutDetail(payoutId: string) {
  const [item, setItem] = useState<PayoutRequestDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!payoutId) return;
    setLoading(true);
    setError(null);
    try {
      setItem(await payoutService.getPayout(payoutId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết yêu cầu.');
    } finally {
      setLoading(false);
    }
  }, [payoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { item, loading, error, refresh: load };
}
