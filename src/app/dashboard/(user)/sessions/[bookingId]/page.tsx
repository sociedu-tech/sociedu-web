import { redirect } from 'next/navigation';
import { programDetailPath } from '@/features/dashboard/lib/programLabels';

type Props = { params: Promise<{ bookingId: string }> };

export default async function LegacySessionDetailRedirect({ params }: Props) {
  const { bookingId } = await params;
  redirect(programDetailPath(bookingId));
}
