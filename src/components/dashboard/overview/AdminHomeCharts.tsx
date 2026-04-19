'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

const mockStats = {
  revenue: [
    { name: 'T1', value: 42 },
    { name: 'T2', value: 38 },
    { name: 'T3', value: 55 },
    { name: 'T4', value: 48 },
    { name: 'T5', value: 62 },
    { name: 'T6', value: 71 },
  ],
  userGrowth: [
    { name: 'T1', users: 120 },
    { name: 'T2', users: 165 },
    { name: 'T3', users: 210 },
    { name: 'T4', users: 280 },
    { name: 'T5', users: 340 },
    { name: 'T6', users: 410 },
  ],
  categoryDistribution: [
    { name: 'Học viên', value: 420 },
    { name: 'Mentor', value: 85 },
    { name: 'Admin', value: 12 },
    { name: 'Khách', value: 200 },
  ],
};

/** Khối biểu đồ tổng quan quản trị */
export function AdminHomeCharts() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="dashboard-stat-tile border-blue-200/80 bg-blue-light/50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Doanh thu hệ thống</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-dark">128,5 tr</p>
          <p className="mt-1 text-xs font-medium text-gray">+12% so với kỳ trước</p>
        </div>
        <div className="dashboard-stat-tile border-emerald-200/80 bg-mint/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-green">Người dùng hoạt động</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-dark">1.240</p>
          <p className="mt-1 text-xs font-medium text-gray">+8% so với kỳ trước</p>
        </div>
        <div className="dashboard-stat-tile border-orange-200/80 bg-peach/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-orange">Giao dịch / tuần</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-dark">3.520</p>
          <p className="mt-1 text-xs font-medium text-gray">+15% so với kỳ trước</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="dashboard-stat-tile space-y-4 p-5">
          <h3 className="text-sm font-semibold text-dark">Doanh thu theo tháng</h3>
          <p className="text-xs text-slate-500">Triệu đồng</p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockStats.revenue}>
                <defs>
                  <linearGradient id="adminArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <Tooltip {...chartTooltipProps} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-area-stroke)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#adminArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-stat-tile space-y-4 p-5">
          <h3 className="text-sm font-semibold text-dark">Tăng trưởng người dùng</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockStats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <Tooltip {...chartTooltipProps} />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Người dùng"
                  stroke="var(--color-chart-line)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--color-chart-line)', strokeWidth: 2, stroke: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-stat-tile space-y-4 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-dark">Phân bổ vai trò</h3>
          <div className="flex h-[260px] flex-col items-center gap-4 sm:flex-row">
            <div className="h-full min-h-[220px] w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockStats.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockStats.categoryDistribution.map((_, i) => (
                      <Cell key={mockStats.categoryDistribution[i].name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipProps} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-wrap justify-center gap-3 sm:flex-col sm:justify-center">
              {mockStats.categoryDistribution.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2 text-xs font-medium text-dark">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {entry.name}: <span className="tabular-nums text-gray">{entry.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
