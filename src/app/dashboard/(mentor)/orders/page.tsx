import { redirect } from 'next/navigation';
import { mentorOrderDetailPath } from '@/features/dashboard/lib/orderLabels';

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function DashboardOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();
  if (orderId) {
    redirect(mentorOrderDetailPath(orderId));
  }

  const { MentorOrdersPage } = await import('@/features/mentor/views/MentorOrdersPage');
  return <MentorOrdersPage />;
}
