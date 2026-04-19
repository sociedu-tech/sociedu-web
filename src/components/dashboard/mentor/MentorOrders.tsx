'use client';

import React from 'react';
import { MENTOR_ORDERS_MOCK } from '@/components/dashboard/mentor/orders/mentorOrdersMock';
import { MentorOrderCard } from '@/components/dashboard/mentor/orders/MentorOrderCard';
import { MentorOrdersSearchBar } from '@/components/dashboard/mentor/orders/MentorOrdersSearchBar';

export const MentorOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <MentorOrdersSearchBar />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MENTOR_ORDERS_MOCK.map((order) => (
          <MentorOrderCard key={order.id} order={order} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          Tải thêm đơn hàng
        </button>
      </div>
    </div>
  );
};
