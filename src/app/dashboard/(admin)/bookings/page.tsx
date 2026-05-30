'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminBookingsView } from '@/features/admin/views/AdminBookingsView';

export default function AdminBookingsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Quản lý đặt lịch (booking)"
        description="Theo dõi buổi học 1-1 và gói dịch vụ: trạng thái thanh toán, xác nhận, đang diễn ra, hoàn thành hoặc hủy."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <p className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            API admin danh sách booking toàn hệ thống chưa có. Khi backend bổ sung endpoint, trang này sẽ tự tải dữ liệu thật.
          </p>
          <AdminBookingsView />
        </div>
      </DashboardSurface>
    </>
  );
}
