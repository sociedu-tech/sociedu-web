'use client';

import { AdminMentorRequests } from '@/components/admin/AdminMentorRequests';
import { DashboardSurface } from '@/components/dashboard/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/components/dashboard/modules/layout/DashboardViewHeader';
import { useAdminData } from '@/hooks/useAdminData';
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
