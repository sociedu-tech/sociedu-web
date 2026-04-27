import Link from 'next/link';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { ROUTES } from '@/constants/routes';

export default function AdminMentorsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Quan ly mentor"
        description="Role mentor duoc cap truc tiep trong trang Nguoi dung."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">
              De cap, ha role hoac kiem soat trang thai tai khoan mentor, vui long vao trang quan ly nguoi dung.
            </p>
            <Link
              href={ROUTES.DASHBOARD.ADMIN.USERS.path}
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Mo trang Nguoi dung
            </Link>
          </div>
        </div>
      </DashboardSurface>
    </>
  );
}
