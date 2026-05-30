'use client';

import { useCallback, useMemo } from 'react';
import { bookingService } from '@/services/bookingService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import type { BookingApi, DashboardSessionRow } from '@/features/dashboard/types/booking';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export type DashboardBookingsRole = 'buyer' | 'mentor';

export function useDashboardBookings(role: DashboardBookingsRole) {
  const paginated = usePaginatedList<unknown>({
    fetchPage: useCallback(
      (page, size) => (role === 'mentor' ? bookingService.listAsMentor(page, size) : bookingService.listAsBuyer(page, size)),
      [role],
    ),
    resetKey: role,
  });

  const rows = useMemo(() => {
    const bookings = paginated.items as BookingApi[];
    return flattenBookingsToSessions(bookings, role);
  }, [paginated.items, role]);

  return {
    rows,
    loading: paginated.loading,
    error: paginated.error,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
  };
}
