import { redirect } from 'next/navigation';
import { programDetailPath } from '@/features/dashboard/lib/programLabels';

type Props = { params: Promise<{ id: string }> };

export default async function LegacyBookingDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(programDetailPath(id));
}
