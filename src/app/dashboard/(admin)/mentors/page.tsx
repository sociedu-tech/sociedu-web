import Link from 'next/link';
import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { ROUTES } from '@/constants/routes';

export default function AdminMentorsPage() {
  return (
    <DashboardPage>
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <Link
              href={ROUTES.DASHBOARD.ADMIN.USERS.path}
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Mở trang Người dùng
            </Link>
          </div>
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
