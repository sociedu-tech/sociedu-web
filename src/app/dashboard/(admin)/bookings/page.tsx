'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { ADMIN_MANAGEMENT_BOOKINGS } from '@/data/adminManagementMock';
import { AdminBookingsView } from '@/features/admin/views/AdminBookingsView';

export default function AdminBookingsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Quản lý đặt lịch (booking)"
        description="Theo dõi buổi học 1-1 và gói dịch vụ: trạng thái thanh toán, xác nhận, đang diễn ra, hoàn thành hoặc hủy. Cập nhật trạng thái để phối hợp mentor và học viên."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminBookingsView initialRows={ADMIN_MANAGEMENT_BOOKINGS} />
        </div>
      </DashboardSurface>
    </>
  );
}
