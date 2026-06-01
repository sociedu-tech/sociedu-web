import { redirect } from 'next/navigation';

export default function LegacyNewProjectPage() {
  redirect('/dashboard/sessions');
}
