'use client';

import { useDashboardBookings } from '@/features/dashboard/hooks/useDashboardBookings';
import { SessionsTable } from '@/features/dashboard/views/sessions/SessionsTable';

export function SessionsListMentor() {
  const { rows, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useDashboardBookings('mentor');

  return (
    <SessionsTable
      counterpartyHeader="Học viên"
      rows={rows}
      loading={loading}
      error={error}
      refresh={refresh}
      page={page}
      size={size}
      total={total}
      totalPages={totalPages}
      setPage={setPage}
      setSize={setSize}
    />
  );
}
