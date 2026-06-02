'use client';

import { AdminMentorRequests } from '@/features/admin/ui/AdminMentorRequests';
import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { useAdminMentorRequestsPage } from '@/features/admin/hooks/useAdminMentorRequestsPage';
import { DataPagination } from '@/components/ui/DataPagination';
import { PageLoadingState } from '@/components/ui/PageLoadingState';

export default function AdminMentorRequestsPage() {
  const {
    requests,
    loading,
    approveMentor,
    page,
    size,
    total,
    totalPages,
    setPage,
    setSize,
  } = useAdminMentorRequestsPage();

  return (
    <DashboardPage>
      <DashboardSurface>
        {loading ? (
          <PageLoadingState label="Đang tải…" variant="cards" cardCount={3} />
        ) : (
          <>
            <AdminMentorRequests requests={requests} onApprove={approveMentor} />
            <DataPagination
              page={page}
              size={size}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onSizeChange={setSize}
              disabled={loading}
            />
          </>
        )}
      </DashboardSurface>
    </DashboardPage>
  );
}
