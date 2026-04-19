'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Users, FolderOpen, Video, Star } from 'lucide-react';
import { ChartPanel, chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

const KPI = {
  activeMentees: 18,
  activeProjects: 11,
  sessionsThisMonth: 42,
  avgRating: 4.8,
};

const revenueByWeek = [
  { t: 'Tuần 1', revenueM: 2.4, sessions: 8 },
  { t: 'Tuần 2', revenueM: 3.1, sessions: 10 },
  { t: 'Tuần 3', revenueM: 2.8, sessions: 9 },
  { t: 'Tuần 4', revenueM: 4.2, sessions: 12 },
];

const projectByStatus = [
  { status: 'Đang hướng dẫn', count: 6 },
  { status: 'Chờ phản hồi', count: 3 },
  { status: 'Hoàn thành giai đoạn', count: 2 },
];

/** Theo tháng (tr) — xu hướng tăng trưởng doanh thu */
const revenueGrowthMonthly = [
  { thang: 'T7', revenueM: 9.2 },
  { thang: 'T8', revenueM: 10.1 },
  { thang: 'T9', revenueM: 11.4 },
  { thang: 'T10', revenueM: 10.8 },
  { thang: 'T11', revenueM: 13.2 },
  { thang: 'T12', revenueM: 14.6 },
];

/** Học viên đang làm việc (ước lượng cuối tháng) */
const menteeGrowthMonthly = [
  { thang: 'T7', hocVien: 11 },
  { thang: 'T8', hocVien: 13 },
  { thang: 'T9', hocVien: 14 },
  { thang: 'T10', hocVien: 16 },
  { thang: 'T11', hocVien: 17 },
  { thang: 'T12', hocVien: 18 },
];

/** Dự án: mới mở vs hoàn thành trong tháng */
const projectMonthly = [
  { thang: 'T7', moMoi: 3, hoanThanh: 2 },
  { thang: 'T8', moMoi: 2, hoanThanh: 1 },
  { thang: 'T9', moMoi: 4, hoanThanh: 3 },
  { thang: 'T10', moMoi: 3, hoanThanh: 2 },
  { thang: 'T11', moMoi: 2, hoanThanh: 4 },
  { thang: 'T12', moMoi: 3, hoanThanh: 2 },
];

const kpiItems = [
  {
    label: 'Học viên đang hoạt động',
    value: KPI.activeMentees,
    icon: Users,
    wrap: 'bg-blue-light text-primary',
  },
  {
    label: 'Dự án đang hướng dẫn',
    value: KPI.activeProjects,
    icon: FolderOpen,
    wrap: 'bg-mint text-secondary-green',
  },
  {
    label: 'Buổi học (tháng này)',
    value: KPI.sessionsThisMonth,
    icon: Video,
    wrap: 'bg-peach text-secondary-orange',
  },
  {
    label: 'Đánh giá trung bình',
    value: `${KPI.avgRating}/5`,
    icon: Star,
    wrap: 'bg-pink-light text-secondary-pink',
  },
] as const;

type MentorOverviewChartsProps = {
  /** Ẩn dải KPI đầu (học viên / buổi / dự án) khi cần tránh trùng layout trang khác. */
  hideKpiStrip?: boolean;
};

export function MentorOverviewCharts({ hideKpiStrip = false }: MentorOverviewChartsProps) {
  return (
    <div className="space-y-6">
      {!hideKpiStrip ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiItems.map((item) => (
            <div key={item.label} className="dashboard-stat-tile flex items-start gap-4 p-5">
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.wrap}`}>
                <item.icon className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-600">{item.label}</p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartPanel title="Tăng trưởng doanh thu">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowthMonthly}>
                <defs>
                  <linearGradient id="mentorRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="thang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  {...chartTooltipProps}
                  formatter={(v) => [`${v} trđ`, 'Doanh thu']}
                />
                <Area
                  type="monotone"
                  dataKey="revenueM"
                  name="Doanh thu"
                  stroke="var(--color-chart-area-stroke)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#mentorRevenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Tăng trưởng học viên">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={menteeGrowthMonthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="thang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                  allowDecimals={false}
                />
                <Tooltip {...chartTooltipProps} formatter={(v) => [v, 'Học viên']} />
                <Line
                  type="monotone"
                  dataKey="hocVien"
                  name="Học viên"
                  stroke="var(--color-chart-line)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--color-chart-line)', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Dự án theo tháng">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectMonthly} margin={{ top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="thang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} allowDecimals={false} />
                <Tooltip {...chartTooltipProps} />
                <Bar dataKey="moMoi" name="Mở mới" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="hoanThanh" name="Hoàn thành" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartPanel title="Doanh thu theo tuần">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByWeek}>
                <defs>
                  <linearGradient id="mentorWeekRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <Tooltip {...chartTooltipProps} formatter={(v) => [`${v} trđ`, 'Doanh thu']} />
                <Area
                  type="monotone"
                  dataKey="revenueM"
                  name="Doanh thu"
                  stroke="var(--color-chart-area-stroke)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#mentorWeekRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Buổi học theo tuần">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByWeek} margin={{ top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} allowDecimals={false} />
                <Tooltip {...chartTooltipProps} formatter={(v) => [v, 'Buổi']} />
                <Bar dataKey="sessions" name="Buổi học" fill="var(--color-chart-line)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Dự án theo trạng thái">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectByStatus} margin={{ bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--color-chart-tick)' }}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={56}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} allowDecimals={false} />
                <Tooltip {...chartTooltipProps} />
                <Bar dataKey="count" name="Số dự án" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </div>
  );
}
