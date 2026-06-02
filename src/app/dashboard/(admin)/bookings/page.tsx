'use client';

import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { AdminProgramList } from '@/features/admin/views/AdminProgramList';

export default function BookingsManagementPage() {
  return (
    <DashboardPage>
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminProgramList />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
