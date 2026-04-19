import { redirect } from 'next/navigation';

/** Doanh thu đã gộp vào Tổng quan mentor (`/dashboard`). */
export default function DashboardRevenueRedirectPage() {
  redirect('/dashboard');
}
