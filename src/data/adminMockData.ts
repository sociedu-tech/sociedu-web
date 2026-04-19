import type { User } from '@/types';

/** `NEXT_PUBLIC_ADMIN_PREVIEW_DATA=false` để gọi API thật; mặc định: dùng dữ liệu mẫu (xem UI). */
export const ADMIN_PREVIEW_DATA_ENABLED = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ADMIN_PREVIEW_DATA === 'true';

const avatar = (seed: string) => `https://i.pravatar.cc/128?u=${encodeURIComponent(seed)}`;

export const ADMIN_MOCK_USERS: User[] = [
  {
    id: 'u-demo-1',
    name: 'Nguyễn Minh An',
    email: 'minhan@student.edu.vn',
    avatar: avatar('minhan'),
    role: 'user',
    joinedDate: '12/03/2026',
    rating: 4.8,
  },
  {
    id: 'u-demo-2',
    name: 'Trần Hải Đăng',
    email: 'dang.tran@company.vn',
    avatar: avatar('haidang'),
    role: 'mentor',
    joinedDate: '02/01/2026',
    totalSales: 42,
    mentorInfo: {
      headline: 'Full-stack & DevOps',
      expertise: ['React', 'Node.js', 'AWS'],
      price: 350000,
      rating: 4.9,
      sessionsCompleted: 128,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'u-demo-3',
    name: 'Lê Thu Hà',
    email: 'thuha@uni.edu.vn',
    avatar: avatar('thuha'),
    role: 'user',
    joinedDate: '28/02/2026',
  },
];

export const ADMIN_MOCK_MENTOR_REQUESTS: User[] = [
  {
    id: 'mr-1',
    name: 'Phạm Quốc Bảo',
    email: 'bao.pq@campus.edu.vn',
    avatar: avatar('quocbao'),
    role: 'mentor',
    joinedDate: '15/04/2026',
    mentorInfo: {
      headline: 'Kỹ sư phần mềm — Web & Mobile',
      expertise: ['TypeScript', 'Next.js', 'Flutter'],
      price: 280000,
      rating: 0,
      sessionsCompleted: 0,
      verificationStatus: 'pending',
    },
  },
  {
    id: 'mr-2',
    name: 'Hoàng Thị Mai',
    email: 'mai.hoang@mail.vn',
    avatar: avatar('hoangmai'),
    role: 'mentor',
    joinedDate: '17/04/2026',
    mentorInfo: {
      headline: 'Data & ML (Python)',
      expertise: ['Pandas', 'PyTorch', 'SQL'],
      price: 400000,
      rating: 0,
      sessionsCompleted: 0,
      verificationStatus: 'pending',
    },
  },
];

export function getAdminMockData(): { users: User[]; mentorRequests: User[] } {
  return {
    users: ADMIN_MOCK_USERS,
    mentorRequests: ADMIN_MOCK_MENTOR_REQUESTS,
  };
}
