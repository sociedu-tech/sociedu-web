'use client';

import { AdminUpdateRequests, useAdminSectionData } from '@/components/admin';

export default function AdminUpdateRequestsPage() {
  const { data, approveUpdate } = useAdminSectionData();
  return <AdminUpdateRequests requests={data.updateRequests} onApprove={approveUpdate} />;
}
