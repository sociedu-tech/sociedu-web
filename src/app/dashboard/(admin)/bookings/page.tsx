'use client';

import { AdminSurface, AdminViewHeader } from '@/components/admin';
import { ADMIN_MANAGEMENT_BOOKINGS } from '@/data/adminManagementMock';
import { AdminBookingsView } from '@/views/admin/AdminBookingsView';

export default function AdminBookingsPage() {
  return (
    <>
      <AdminViewHeader
        title="Quản lý đặt lịch (booking)"
        description="Theo dõi buổi học 1-1 và gói dịch vụ: trạng thái thanh toán, xác nhận, đang diễn ra, hoàn thành hoặc hủy. Cập nhật trạng thái để phối hợp mentor và học viên."
      />
      <AdminSurface>
        <div className="p-4 sm:p-6">
          <AdminBookingsView initialRows={ADMIN_MANAGEMENT_BOOKINGS} />
        </div>
      </AdminSurface>
    </>
  );
}
