'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { chartTooltipProps } from '@/components/dashboard/overview/chartPrimitives';

type Props = {
  data: { name: string; value: number }[];
  height?: number;
  colorVar?: string;
  valueLabel?: string;
  maxBarSize?: number;
};

export function StatsHorizontalBarChart({
  data,
  height = 260,
  colorVar = 'var(--color-chart-line)',
  valueLabel = 'Giá trị',
  maxBarSize = 26,
}: Props) {
  return (
    <div style={{ height }} className="w-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
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
          <Tooltip
            {...chartTooltipProps}
            formatter={(v) => [`${v ?? 0}%`, valueLabel]}
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            fill={colorVar}
            radius={[0, 6, 6, 0]}
            maxBarSize={maxBarSize}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
