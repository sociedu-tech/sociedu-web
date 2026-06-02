'use client';

import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { AdminUsersManagementView } from '@/features/admin/views/AdminUsersManagementView';

export default function AdminSupervisorsPage() {
  return (
    <DashboardPage>
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView defaultRole="admin" />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
