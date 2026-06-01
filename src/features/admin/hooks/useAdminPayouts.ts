'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminPayoutService } from '@/services/adminPayoutService';
import type { PayoutRequestDto } from '@/services/payoutService';

export function useAdminPayouts(status?: string, page = 0, size = 20) {
  const [items, setItems] = useState<PayoutRequestDto[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageData = await adminPayoutService.list(page, size, status);
      setItems(pageData.items);
      setTotalElements(pageData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được yêu cầu rút tiền.');
    } finally {
      setLoading(false);
    }
  }, [page, size, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, totalElements, loading, error, refresh: load };
}

export function useAdminPayoutDetail(payoutId: string) {
  const [item, setItem] = useState<PayoutRequestDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!payoutId) return;
    setLoading(true);
    setError(null);
    try {
      setItem(await adminPayoutService.getById(payoutId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết.');
    } finally {
      setLoading(false);
    }
  }, [payoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { item, loading, error, refresh: load };
}
