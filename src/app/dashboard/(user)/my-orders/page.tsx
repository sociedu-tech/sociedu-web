import { redirect } from 'next/navigation';
import { userOrderDetailPath } from '@/features/dashboard/lib/orderLabels';

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function DashboardMyOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();
  if (orderId) {
    redirect(userOrderDetailPath(orderId));
  }

  const { UserOrdersPage } = await import('@/features/user/views/UserOrdersPage');
  return <UserOrdersPage />;
}
