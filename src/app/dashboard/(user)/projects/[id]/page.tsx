import { ProjectsDetailHub } from '@/features/dashboard/views/projects/ProjectsDetailHub';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DashboardProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectsDetailHub projectId={id} />;
}
