import { redirect } from 'next/navigation';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

export default function LegacyScheduleRedirect() {
  redirect(MENTORING_PATH);
}
