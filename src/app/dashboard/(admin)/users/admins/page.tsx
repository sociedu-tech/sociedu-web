'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminUsersManagementView } from '@/features/admin/views/AdminUsersManagementView';

export default function AdminSupervisorsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Ban quản trị"
        description="Danh sách tài khoản quản trị viên, ban điều hành và phân quyền vận hành hệ thống."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView defaultRole="admin" />
        </div>
      </DashboardSurface>
    </>
  );
}
