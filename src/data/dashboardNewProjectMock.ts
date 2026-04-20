import type { User } from '@/types';

/** Lĩnh vực gợi ý — khớp với `mentorInfo.expertise` và tính điểm gợi ý. */
export const NEW_PROJECT_TOPIC_TAGS = [
  'Lập trình web',
  'Mobile / Flutter',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'DevOps & Cloud',
  'Kỹ năng mềm',
  'IELTS / Academic writing',
  'Khóa luận / Đồ án',
  'Startup & Product',
] as const;

export const NEW_PROJECT_DURATION_OPTIONS = [
  { value: '1-2w', label: '1–2 tuần' },
  { value: '1m', label: 'Khoảng 1 tháng' },
  { value: '2-3m', label: '2–3 tháng' },
  { value: '3m+', label: 'Trên 3 tháng' },
] as const;

/** Khi API chưa có mentor — demo luồng gợi ý. */
export const NEW_PROJECT_DEMO_MENTORS: User[] = [
  {
    id: 'demo-m1',
    name: 'Phạm Minh An',
    email: '',
    avatar: 'https://i.pravatar.cc/128?img=12',
    role: 'mentor',
    joinedDate: new Date().toISOString(),
    rating: 4.9,
    mentorInfo: {
      headline: 'Full-stack & hướng dẫn đồ án web',
      expertise: ['Lập trình web', 'DevOps & Cloud', 'Khóa luận / Đồ án'],
      price: 45,
      rating: 4.9,
      sessionsCompleted: 128,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-m2',
    name: 'Lê Thu Hà',
    email: '',
    avatar: 'https://i.pravatar.cc/128?img=45',
    role: 'mentor',
    joinedDate: new Date().toISOString(),
    rating: 4.8,
    mentorInfo: {
      headline: 'Data & ML — từ ý tưởng đến báo cáo',
      expertise: ['Data Science', 'Machine Learning', 'IELTS / Academic writing'],
      price: 55,
      rating: 4.8,
      sessionsCompleted: 96,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-m3',
    name: 'Trần Đức Kiên',
    email: '',
    avatar: 'https://i.pravatar.cc/128?img=33',
    role: 'mentor',
    joinedDate: new Date().toISOString(),
    rating: 4.7,
    mentorInfo: {
      headline: 'UI/UX & pitch deck cho startup',
      expertise: ['UI/UX Design', 'Startup & Product', 'Kỹ năng mềm'],
      price: 40,
      rating: 4.7,
      sessionsCompleted: 74,
      verificationStatus: 'verified',
    },
  },
];
