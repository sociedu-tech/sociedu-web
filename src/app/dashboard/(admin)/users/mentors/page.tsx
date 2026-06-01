'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminUsersManagementView } from '@/features/admin/views/AdminUsersManagementView';

export default function AdminMentorsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Quản lý mentor"
        description="Danh sách tài khoản Mentor, quản lý thông tin hoạt động, phê duyệt và phân vai trò trên hệ thống."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView defaultRole="mentor" />
        </div>
      </DashboardSurface>
    </>
  );
}
