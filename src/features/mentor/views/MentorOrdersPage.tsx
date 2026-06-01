'use client';

import React from 'react';
import { MentorOrders } from '@/features/dashboard/ui/mentor/MentorOrders';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';

export const MentorOrdersPage = () => {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Đơn hàng"
        description="Theo dõi và xử lý đơn từ học viên: trạng thái thanh toán, xác nhận hoặc từ chối."
        layout="compact"
      />
      <MentorOrders />
    </DashboardPage>
  );
};
