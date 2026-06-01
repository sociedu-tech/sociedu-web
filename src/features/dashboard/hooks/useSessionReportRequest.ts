'use client';

import { useCallback, useEffect, useState } from 'react';
import { sessionReportService, type SessionReportRequest } from '@/services/sessionReportService';

export function useSessionReportRequest(bookingId: string, requestId: string) {
  const [request, setRequest] = useState<SessionReportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!bookingId || !requestId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await sessionReportService.listForBooking(bookingId);
      const found = list.find((item) => item.id === requestId) ?? null;
      if (!found) {
        setError('Không tìm thấy yêu cầu báo cáo.');
      }
      setRequest(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được báo cáo.');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId, requestId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { request, loading, error, refresh };
}
