import { MentorDashboard } from '@/views/mentor/MentorDashboard';

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorDashboard>{children}</MentorDashboard>;
}
