'use client';

import { AdminSurface, AdminViewHeader } from '@/components/admin';
import { ADMIN_MANAGEMENT_USERS } from '@/data/adminManagementMock';
import { AdminUsersManagementView } from '@/views/admin/AdminUsersManagementView';

export default function AdminUsersPage() {
  return (
    <>
      <AdminViewHeader
        title="Người dùng & phân quyền"
        description="Xem trạng thái tài khoản, lọc theo vai trò, tạm khóa hoặc cấp quyền mentor cho học viên. Dữ liệu mẫu — kết nối API để đồng bộ thật."
      />
      <AdminSurface>
        <div className="p-4 sm:p-6">
          <AdminUsersManagementView initialUsers={ADMIN_MANAGEMENT_USERS} />
        </div>
      </AdminSurface>
    </>
  );
}
