'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { ADMIN_MANAGEMENT_REPORTS } from '@/data/adminManagementMock';
import { AdminModerationReportsView } from '@/features/admin/views/AdminModerationReportsView';

export default function AdminModerationPage() {
  return (
    <>
      <DashboardViewHeader
        title="Báo cáo & khiếu nại"
        description="Tiếp nhận phản ánh về người dùng, mentor, booking, buổi học và đánh giá. Phân loại theo đối tượng và cập nhật trạng thái xử lý (mới → đang xử lý → đã xử lý / bỏ qua)."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportsView initialReports={ADMIN_MANAGEMENT_REPORTS} />
        </div>
      </DashboardSurface>
    </>
  );
}
