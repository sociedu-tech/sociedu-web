'use client';

import React from 'react';
import { MentorOrders } from '@/features/dashboard/ui/mentor/MentorOrders';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';

export const MentorOrdersPage = () => {
  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Đơn hàng"
        description="Theo dõi và xử lý đơn từ học viên: trạng thái thanh toán, xác nhận hoặc từ chối."
        layout="compact"
      />
      <MentorOrders />
    </div>
  );
};
