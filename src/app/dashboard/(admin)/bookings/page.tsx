'use client';

import { DashboardPage, DashboardViewHeader, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { AdminProgramList } from '@/features/admin/views/AdminProgramList';

export default function BookingsManagementPage() {
  return (
    <DashboardPage>
      <DashboardViewHeader
        title="Quản lý đặt lịch"
        description="Giám sát và theo dõi toàn bộ lịch đặt mentoring (bookings) trên hệ thống."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminProgramList />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
