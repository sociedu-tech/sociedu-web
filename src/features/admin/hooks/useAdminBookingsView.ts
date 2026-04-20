import { useMemo, useState } from 'react';
import type { AdminBookingRow, BookingStatus } from '@/types';

export function useAdminBookingsView(initialRows: AdminBookingRow[]) {
  const [rows, setRows] = useState<AdminBookingRow[]>(initialRows);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const updateStatus = (id: string, status: BookingStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return { rows, statusFilter, setStatusFilter, filtered, updateStatus };
}
