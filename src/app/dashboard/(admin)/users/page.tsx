'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminUsersManagementView } from '@/features/admin/views/AdminUsersManagementView';

export default function AdminUsersPage() {
  return (
    <>
      <DashboardViewHeader
        title="Quản lý học viên"
        description="Danh sách tài khoản học viên, quản lý quyền truy cập và phân vai trò trên hệ thống."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView defaultRole="user" />
        </div>
      </DashboardSurface>
    </>
  );
}
