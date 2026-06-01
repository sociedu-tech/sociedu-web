import { redirect } from 'next/navigation';

export default function LegacyMyReportsPage() {
  redirect('/dashboard/sessions');
}
