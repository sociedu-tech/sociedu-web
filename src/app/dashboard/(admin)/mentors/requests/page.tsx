'use client';

import { AdminMentorRequests } from '@/features/admin/ui/AdminMentorRequests';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { useAdminMentorRequestsPage } from '@/features/admin/hooks/useAdminMentorRequestsPage';
import { DataPagination } from '@/components/ui/DataPagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
    <>
      <DashboardViewHeader
        title="Yêu cầu trở thành mentor"
        description="Xem hồ sơ đăng ký, kiểm tra chuyên môn và duyệt hoặc từ chối. Người được duyệt sẽ xuất hiện trên phần tìm mentor."
        layout="compact"
      />
      <DashboardSurface>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Đang tải…" />
          </div>
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
    </>
  );
}
