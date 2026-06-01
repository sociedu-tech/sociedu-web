'use client';

import React from 'react';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { UserOrdersList } from '@/features/dashboard/views/orders/UserOrdersList';

export function UserOrdersPage() {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Học tập"
        title="Đơn hàng của tôi"
        description="Theo dõi lịch sử đặt gói mentor và trạng thái thanh toán trên hệ thống."
        layout="compact"
      />
      <UserOrdersList />
    </DashboardPage>
  );
}
