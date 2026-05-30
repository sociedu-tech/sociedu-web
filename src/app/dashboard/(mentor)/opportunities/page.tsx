import { redirect } from 'next/navigation';

/** Cơ hội dự án đã gỡ — chuyển về tổng quan mentor. */
export default function DashboardMentorOpportunitiesPage() {
  redirect('/dashboard');
}
