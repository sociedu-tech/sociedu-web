'use client';

import { AdminMentorRequests } from '@/features/admin/ui/AdminMentorRequests';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { useAdminData } from '@/features/admin/hooks';
export default function AdminMentorRequestsPage() {
  const { data, approveMentor } = useAdminData();
  return (
    <>
      <DashboardViewHeader
        title="Yêu cầu trở thành mentor"
        description="Xem hồ sơ đăng ký, kiểm tra chuyên môn và duyệt hoặc từ chối. Người được duyệt sẽ xuất hiện trên phần tìm mentor."
        layout="compact"
      />
      <DashboardSurface>
        <AdminMentorRequests requests={data.mentorRequests} onApprove={approveMentor} />
      </DashboardSurface>
    </>
  );
}
