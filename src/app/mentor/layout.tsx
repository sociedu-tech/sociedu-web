import { MentorDashboard } from '@/views/mentor/MentorDashboard';

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorDashboard>{children}</MentorDashboard>;
}
