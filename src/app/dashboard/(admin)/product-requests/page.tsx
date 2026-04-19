'use client';

import { AdminProductRequests, useAdminSectionData } from '@/components/admin';

export default function AdminProductRequestsPage() {
  const { data, approveProduct } = useAdminSectionData();
  return <AdminProductRequests requests={data.productRequests} onApprove={approveProduct} />;
}
