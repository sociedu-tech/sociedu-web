import { redirect } from 'next/navigation';
import { programReportPath } from '@/features/dashboard/lib/programLabels';

type Props = { params: Promise<{ bookingId: string }> };

export default async function LegacyScheduleReportRedirect({ params }: Props) {
  const { bookingId } = await params;
  redirect(programReportPath(bookingId));
}
