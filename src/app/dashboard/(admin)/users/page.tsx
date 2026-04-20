'use client';

import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { ADMIN_MANAGEMENT_USERS } from '@/data/adminManagementMock';
import { AdminUsersManagementView } from '@/features/admin/views/AdminUsersManagementView';

export default function AdminUsersPage() {
  return (
    <>
      <DashboardViewHeader
        title="Người dùng & phân quyền"
        description="Xem trạng thái tài khoản, lọc theo vai trò, tạm khóa hoặc cấp quyền mentor cho học viên. Dữ liệu mẫu — kết nối API để đồng bộ thật."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView initialUsers={ADMIN_MANAGEMENT_USERS} />
        </div>
      </DashboardSurface>
    </>
  );
}
