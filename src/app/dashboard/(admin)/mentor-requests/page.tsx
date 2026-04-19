'use client';

import { AdminMentorRequests, useAdminSectionData } from '@/components/admin';

export default function AdminMentorRequestsPage() {
  const { data, approveMentor } = useAdminSectionData();
  return <AdminMentorRequests requests={data.mentorRequests} onApprove={approveMentor} />;
}
