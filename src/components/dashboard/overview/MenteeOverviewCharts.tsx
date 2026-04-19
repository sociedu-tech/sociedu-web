'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  PlayCircle,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { ChartPanel, chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

/** Dữ liệu mẫu — nối API sau */
const KPI = {
  /** Dự án đang thực hiện */
  inProgress: 4,
  /** Buổi đã tham gia trong tháng */
  sessionsThisMonth: 8,
  /** Báo cáo / nhiệm vụ còn hạn */
  pendingItems: 3,
  /** Dự án đã hoàn thành */
  completed: 5,
};

const nextSession = {
  label: 'Thứ Tư, 23/04/2026 · 20:00',
  detail: 'Đồ án web — Mentor: Minh Trần',
};

const statusDistribution = [
  { name: 'Đang làm', value: 4, key: 'doing' },
  { name: 'Hoàn thành', value: 5, key: 'done' },
  { name: 'Chưa bắt đầu', value: 3, key: 'todo' },
];

const weeklyTasks = [
  { week: 'T1', tasksDone: 3 },
  { week: 'T2', tasksDone: 5 },
  { week: 'T3', tasksDone: 4 },
  { week: 'T4', tasksDone: 7 },
  { week: 'T5', tasksDone: 6 },
  { week: 'T6', tasksDone: 8 },
];

/** Buổi học đã diễn ra mỗi tuần (gần đây) */
const weeklySessions = [
  { week: 'T1', buoi: 1 },
  { week: 'T2', buoi: 2 },
  { week: 'T3', buoi: 1 },
  { week: 'T4', buoi: 2 },
  { week: 'T5', buoi: 2 },
  { week: 'T6', buoi: 2 },
];

const projectProgress = [
  { name: 'Đồ án web React', pct: 78 },
  { name: 'API Node + DB', pct: 45 },
  { name: 'Báo cáo tốt nghiệp', pct: 92 },
  { name: 'Ứng dụng mobile', pct: 30 },
];

const sessionsByMonth = [
  { thang: 'T7', soBuoi: 2 },
  { thang: 'T8', soBuoi: 3 },
  { thang: 'T9', soBuoi: 2 },
  { thang: 'T10', soBuoi: 4 },
  { thang: 'T11', soBuoi: 3 },
  { thang: 'T12', soBuoi: 4 },
];

const reportMix = [
  { name: 'Đã nộp', value: 5, key: 'done' },
  { name: 'Chờ nộp', value: 2, key: 'wait' },
  { name: 'Quá hạn', value: 1, key: 'late' },
];

const avgProgressByMonth = [
  { thang: 'T7', pct: 48 },
  { thang: 'T8', pct: 55 },
  { thang: 'T9', pct: 58 },
  { thang: 'T10', pct: 62 },
  { thang: 'T11', pct: 68 },
  { thang: 'T12', pct: 71 },
];

const kpiItems = [
  {
    label: 'Dự án đang làm',
    value: KPI.inProgress,
    icon: PlayCircle,
    wrap: 'bg-peach text-secondary-orange',
  },
  {
    label: 'Buổi học (tháng này)',
    value: KPI.sessionsThisMonth,
    icon: Video,
    wrap: 'bg-blue-light text-primary',
  },
  {
    label: 'Việc cần xử lý',
    value: KPI.pendingItems,
    icon: ClipboardList,
    wrap: 'bg-purple-light text-secondary-purple',
  },
  {
    label: 'Dự án hoàn thành',
    value: KPI.completed,
    icon: CheckCircle2,
    wrap: 'bg-mint text-secondary-green',
  },
] as const;

export function MenteeOverviewCharts() {
  return (
    <div className="space-y-6">
      <div className="dashboard-stat-tile flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-light text-primary">
            <CalendarDays className="size-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray">Buổi học tiếp theo</p>
            <p className="mt-0.5 text-sm font-semibold text-dark">{nextSession.label}</p>
            <p className="mt-0.5 truncate text-xs text-gray">{nextSession.detail}</p>
          </div>
        </div>
        <Link
          href="/dashboard/sessions"
          className="shrink-0 text-sm font-medium text-primary hover:underline sm:text-right"
        >
          Xem lịch
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiItems.map((item) => (
          <div key={item.label} className="dashboard-stat-tile flex items-start gap-4 p-5">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.wrap}`}>
              <item.icon className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray">{item.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ChartPanel title="Trạng thái dự án">
          <div className="flex h-[240px] flex-col items-center justify-center sm:flex-row sm:gap-4">
            <div className="h-[200px] w-full sm:w-[52%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, i) => (
                      <Cell key={statusDistribution[i].key} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipProps} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-wrap justify-center gap-2 sm:flex-col sm:justify-center">
              {statusDistribution.map((s, i) => (
                <li key={s.key} className="flex items-center gap-2 text-xs font-medium text-dark">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {s.name}: <span className="tabular-nums text-gray">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartPanel>

        <ChartPanel title="Mục tiêu đã hoàn thành (theo tuần)">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTasks}>
                <defs>
                  <linearGradient id="menteeArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} />
                <Tooltip {...chartTooltipProps} />
                <Area
                  type="monotone"
                  dataKey="tasksDone"
                  name="Mục tiêu"
                  stroke="var(--color-chart-area-stroke)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#menteeArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Buổi học theo tuần">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySessions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="week"
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
                <Tooltip {...chartTooltipProps} formatter={(v) => [v, 'Buổi']} />
                <Line
                  type="monotone"
                  dataKey="buoi"
                  name="Buổi học"
                  stroke="var(--color-chart-line)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--color-chart-line)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ChartPanel title="Buổi học theo tháng">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsByMonth} margin={{ top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="thang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }} allowDecimals={false} />
                <Tooltip {...chartTooltipProps} formatter={(v) => [v, 'Buổi']} />
                <Bar dataKey="soBuoi" name="Buổi" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Báo cáo & nhiệm vụ">
          <div className="flex h-[240px] flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="h-[200px] w-full sm:w-[58%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {reportMix.map((_, i) => (
                      <Cell key={reportMix[i].key} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipProps} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-wrap justify-center gap-2 sm:flex-col sm:justify-center">
              {reportMix.map((s, i) => (
                <li key={s.key} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {s.name}: <span className="tabular-nums text-slate-500">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartPanel>

        <ChartPanel title="Tiến độ trung bình dự án">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgProgressByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis
                  dataKey="thang"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip {...chartTooltipProps} formatter={(v) => [`${v}%`, 'Trung bình']} />
                <Line
                  type="monotone"
                  dataKey="pct"
                  name="Tiến độ TB"
                  stroke="var(--color-chart-area-stroke)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--color-chart-area-stroke)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      <ChartPanel title="Tiến độ dự án đang làm">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectProgress} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-chart-grid)" />
              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                width={132}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--color-chart-tick)' }}
              />
              <Tooltip {...chartTooltipProps} formatter={(v) => [`${v ?? 0}%`, 'Tiến độ']} />
              <Bar dataKey="pct" name="Tiến độ" fill="var(--color-chart-line)" radius={[0, 6, 6, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-3 text-xs">
          <Link href="/dashboard/projects/progress" className="font-medium text-primary hover:underline">
            Tiến độ chi tiết
          </Link>
          <Link href="/dashboard/projects" className="font-medium text-primary hover:underline">
            Danh sách dự án
          </Link>
        </div>
      </ChartPanel>
    </div>
  );
}
