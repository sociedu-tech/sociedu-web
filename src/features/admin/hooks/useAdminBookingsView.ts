'use client';

import { useCallback, useState } from 'react';
import type { AdminBookingRow, BookingStatus } from '@/types';
import { adminBookingService } from '@/services/adminBookingService';
import { bookingService } from '@/services/bookingService';
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

  const updateStatus = async (id: string, status: BookingStatus) => {
    if (status === 'cancelled_by_user' || status === 'cancelled_by_mentor' || status === 'no_show') {
      const reason = prompt('Nhập lý do hủy đặt lịch:') || 'Admin hủy bỏ';
      setOverrides((prev) => ({ ...prev, [id]: status }));
      try {
        await bookingService.cancelBooking(id, reason);
        await paginated.refresh();
      } catch (err: unknown) {
        console.error('Lỗi khi hủy booking:', err);
        alert(err instanceof Error ? err.message : 'Lỗi khi hủy booking');
        await paginated.refresh();
      }
    } else {
      alert('Thay đổi trạng thái này do hệ thống điều khiển tự động qua luồng thanh toán và xác nhận buổi học.');
    }
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
