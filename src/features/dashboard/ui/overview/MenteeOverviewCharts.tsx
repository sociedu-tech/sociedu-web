'use client';

import { MenteeNextSessionBanner } from '@/features/dashboard/ui/overview/mentee/MenteeNextSessionBanner';
import { MenteeOverviewKpiGrid } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewKpiGrid';
import { MenteeOverviewChartGrids } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewChartGrids';
import { MenteeOverviewProgressSection } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewProgressSection';

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
