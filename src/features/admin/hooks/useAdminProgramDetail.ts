'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminBookingService } from '@/services/adminBookingService';
import type { AdminBookingRow } from '@/types';

export function useAdminProgramDetail(bookingId: string) {
  const [item, setItem] = useState<AdminBookingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const row = await adminBookingService.getById(bookingId);
      setItem(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết chương trình.');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { item, loading, error, refresh };
}
