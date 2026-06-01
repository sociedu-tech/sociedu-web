'use client';

import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { AdminProgramList } from '@/features/admin/views/AdminProgramList';

export default function BookingsManagementPage() {
  return (
    <div className="space-y-6 pb-2">
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
    </div>
  );
}
