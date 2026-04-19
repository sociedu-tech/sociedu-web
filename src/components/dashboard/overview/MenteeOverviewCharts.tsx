'use client';

import { MenteeNextSessionBanner } from '@/components/dashboard/overview/mentee/MenteeNextSessionBanner';
import { MenteeOverviewKpiGrid } from '@/components/dashboard/overview/mentee/MenteeOverviewKpiGrid';
import { MenteeOverviewChartGrids } from '@/components/dashboard/overview/mentee/MenteeOverviewChartGrids';
import { MenteeOverviewProgressSection } from '@/components/dashboard/overview/mentee/MenteeOverviewProgressSection';

/** Tổng quan học viên — ghép từ các khối nhỏ trong `overview/mentee/`. */
export function MenteeOverviewCharts() {
  return (
    <div className="space-y-6">
      <MenteeNextSessionBanner />
      <MenteeOverviewKpiGrid />
      <MenteeOverviewChartGrids />
      <MenteeOverviewProgressSection />
    </div>
  );
}
