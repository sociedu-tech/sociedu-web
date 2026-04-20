export type ProjectProgressStatus = 'doing' | 'done' | 'paused';

export type ProjectProgressRow = {
  id: string;
  project: string;
  counterparty: string;
  progress: number;
  status: ProjectProgressStatus;
  updatedAt: string;
};

export const MOCK_PROJECT_PROGRESS_MENTEE: ProjectProgressRow[] = [
  {
    id: '1',
    project: 'Đồ án web React + API',
    counterparty: 'Nguyễn Minh · Mentor',
    progress: 72,
    status: 'doing',
    updatedAt: '17/04/2026',
  },
  {
    id: '2',
    project: 'Báo cáo tốt nghiệp',
    counterparty: 'Trần Lan · Mentor',
    progress: 100,
    status: 'done',
    updatedAt: '12/04/2026',
  },
  {
    id: '3',
    project: 'Ứng dụng Flutter MVP',
    counterparty: 'Lê Hải · Mentor',
    progress: 28,
    status: 'doing',
    updatedAt: '18/04/2026',
  },
];

export const MOCK_PROJECT_PROGRESS_MENTOR: ProjectProgressRow[] = [
  {
    id: 'm1',
    project: 'Đồ án web React + API',
    counterparty: 'Học viên: Đỗ Quang Hợp',
    progress: 72,
    status: 'doing',
    updatedAt: '17/04/2026',
  },
  {
    id: 'm2',
    project: 'Data pipeline Python',
    counterparty: 'Học viên: Phạm An',
    progress: 45,
    status: 'doing',
    updatedAt: '16/04/2026',
  },
  {
    id: 'm3',
    project: 'Kiến trúc microservices',
    counterparty: 'Học viên: Vũ Khánh',
    progress: 100,
    status: 'done',
    updatedAt: '10/04/2026',
  },
  {
    id: 'm4',
    project: 'Mobile UI/UX',
    counterparty: 'Học viên: Mai Chi',
    progress: 15,
    status: 'paused',
    updatedAt: '08/04/2026',
  },
];

export const PROJECT_PROGRESS_FILTERS: { id: 'all' | ProjectProgressStatus; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'doing', label: 'Đang làm' },
  { id: 'done', label: 'Hoàn thành' },
  { id: 'paused', label: 'Tạm dừng' },
];
