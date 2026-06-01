import { redirect } from 'next/navigation';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

export default function LegacyNewProjectPage() {
  redirect(MENTORING_PATH);
}
