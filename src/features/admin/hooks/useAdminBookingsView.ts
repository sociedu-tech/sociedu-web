'use client';

import { useCallback, useState } from 'react';
import type { AdminBookingRow, BookingStatus } from '@/types';
import { adminBookingService } from '@/services/adminBookingService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export function useAdminBookingsView() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [overrides, setOverrides] = useState<Record<string, BookingStatus>>({});

  const paginated = usePaginatedList<AdminBookingRow>({
    fetchPage: useCallback(
      (page, size) =>
        adminBookingService.list({
          page,
          size,
          status: statusFilter === 'all' ? undefined : statusFilter,
        }),
      [statusFilter],
    ),
    resetKey: statusFilter,
  });

  const filtered = paginated.items.map((r) =>
    overrides[r.id] ? { ...r, status: overrides[r.id] } : r,
  );

  const updateStatus = (id: string, status: BookingStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: status }));
  };

  return {
    rows: paginated.items,
    loading: paginated.loading,
    error: paginated.error,
    statusFilter,
    setStatusFilter,
    filtered,
    updateStatus,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
  };
}
