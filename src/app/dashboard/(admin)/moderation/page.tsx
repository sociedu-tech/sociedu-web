'use client';

import { AdminSurface, AdminViewHeader } from '@/components/admin';
import { ADMIN_MANAGEMENT_REPORTS } from '@/data/adminManagementMock';
import { AdminModerationReportsView } from '@/views/admin/AdminModerationReportsView';

export default function AdminModerationPage() {
  return (
    <>
      <AdminViewHeader
        title="Báo cáo & khiếu nại"
        description="Tiếp nhận phản ánh về người dùng, mentor, booking, buổi học và đánh giá. Phân loại theo đối tượng và cập nhật trạng thái xử lý (mới → đang xử lý → đã xử lý / bỏ qua)."
      />
      <AdminSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportsView initialReports={ADMIN_MANAGEMENT_REPORTS} />
        </div>
      </AdminSurface>
    </>
  );
}
