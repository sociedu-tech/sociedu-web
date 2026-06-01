'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminBookingService } from '@/services/adminBookingService';
import { bookingService } from '@/services/bookingService';
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
      const [adminRes, publicRes] = await Promise.allSettled([
        adminBookingService.getById(bookingId),
        bookingService.getById(bookingId),
      ]);

      if (adminRes.status === 'rejected') {
        throw adminRes.reason;
      }

      const row = adminRes.value;

      if (publicRes.status === 'fulfilled' && publicRes.value) {
        const pubData = publicRes.value as any;
        if (pubData.sessions) {
          row.sessions = pubData.sessions;
        }
        if (pubData.progressPercent != null) {
          row.progressPercent = pubData.progressPercent;
        }
      }

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

