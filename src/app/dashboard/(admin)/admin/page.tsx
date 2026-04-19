import { redirect } from 'next/navigation';
import { ADMIN_PATHS } from '@/components/admin/adminPaths';

/** `/dashboard/admin` → mặc định vào trang thống kê. */
export default function AdminIndexPage() {
  redirect(ADMIN_PATHS.stats);
}
