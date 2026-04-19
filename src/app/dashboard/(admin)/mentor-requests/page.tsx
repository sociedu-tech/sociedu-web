'use client';

import { AdminMentorRequests, AdminSurface, AdminViewHeader, useAdminSectionData } from '@/components/admin';

export default function AdminMentorRequestsPage() {
  const { data, approveMentor } = useAdminSectionData();
  return (
    <>
      <AdminViewHeader
        title="Yêu cầu trở thành mentor"
        description="Xem hồ sơ đăng ký, kiểm tra chuyên môn và duyệt hoặc từ chối. Người được duyệt sẽ xuất hiện trên phần tìm mentor."
      />
      <AdminSurface>
        <AdminMentorRequests requests={data.mentorRequests} onApprove={approveMentor} />
      </AdminSurface>
    </>
  );
}
