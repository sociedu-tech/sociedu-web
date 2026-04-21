import type { User, Product } from '@/types';

export const EMPTY_MENTORS: User[] = [];

/** Danh sách demo khi API trả rỗng / lỗi — chỉ dùng trong `NODE_ENV === 'development'` (xem `mentorService`). */
export const SAMPLE_PUBLIC_MENTORS: User[] = [
  {
    id: 'demo-mentor-1',
    name: 'Nguyễn Minh An',
    email: 'minhan@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo1',
    role: 'mentor',
    joinedDate: '2024-01-10T00:00:00.000Z',
    university: 'ĐHQG TP.HCM — UIT',
    major: 'Khoa học máy tính',
    year: 2021,
    skills: ['React', 'TypeScript', 'Node.js'],
    mentorInfo: {
      headline: 'Kèm đồ án web, React, Node · BTL',
      expertise: ['Đồ án web', 'React', 'BTL'],
      price: 22,
      rating: 4.8,
      sessionsCompleted: 48,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-mentor-2',
    name: 'Trần Thu Hà',
    email: 'thuha@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo2',
    role: 'mentor',
    joinedDate: '2023-06-01T00:00:00.000Z',
    university: 'Đại học Kinh tế Quốc dân',
    major: 'Kinh tế đầu tư',
    year: 2020,
    skills: ['Excel', 'STATA', 'NCKH'],
    mentorInfo: {
      headline: 'NCKH Kinh tế, khóa luận, SPSS/STATA',
      expertise: ['NCKH', 'Khóa luận', 'Kinh tế'],
      price: 28,
      rating: 4.6,
      sessionsCompleted: 22,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-mentor-3',
    name: 'Lê Đức Thịnh',
    email: 'ducthinh@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo3',
    role: 'mentor',
    joinedDate: '2024-03-15T00:00:00.000Z',
    university: 'ĐHBK Hà Nội',
    major: 'Điện — Điện tử',
    year: 2019,
    skills: ['MATLAB', 'Simulink', 'Đồ án mạch'],
    mentorInfo: {
      headline: 'Đồ án Điện tử, vi xử lý, nhúng',
      expertise: ['Điện tử', 'Vi xử lý', 'BTL'],
      price: 35,
      rating: 4.9,
      sessionsCompleted: 61,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-mentor-4',
    name: 'Phạm Gia Linh',
    email: 'gialinh@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo4',
    role: 'mentor',
    joinedDate: '2023-11-20T00:00:00.000Z',
    university: 'ĐHQG TP.HCM — UIT',
    major: 'An toàn thông tin',
    year: 2022,
    skills: ['Python', 'Cryptography', 'Network'],
    mentorInfo: {
      headline: 'An toàn mạng, đồ án ATTT, BTL',
      expertise: ['An toàn thông tin', 'Mạng máy tính'],
      price: 30,
      rating: 4.4,
      sessionsCompleted: 12,
      verificationStatus: 'pending',
    },
  },
  {
    id: 'demo-mentor-5',
    name: 'Hoàng Việt',
    email: 'viet@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo5',
    role: 'mentor',
    joinedDate: '2024-02-01T00:00:00.000Z',
    university: 'ĐH Bách khoa TP.HCM',
    major: 'Cơ khí chế tạo máy',
    year: 2018,
    skills: ['SolidWorks', 'CAD'],
    mentorInfo: {
      headline: 'Đồ án cơ khí, CAD, mô phỏng',
      expertise: ['Cơ khí', 'Đồ án tốt nghiệp'],
      price: 26,
      rating: 4.7,
      sessionsCompleted: 35,
      verificationStatus: 'verified',
    },
  },
  {
    id: 'demo-mentor-6',
    name: 'Đặng Khánh Ngọc',
    email: 'khanhngoc@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo6',
    role: 'mentor',
    joinedDate: '2023-09-10T00:00:00.000Z',
    university: 'Đại học Ngoại thương Hà Nội',
    major: 'Kinh doanh quốc tế',
    year: 2021,
    skills: ['Tiếng Anh thương mại', 'CV', 'Mock interview'],
    mentorInfo: {
      headline: 'Phỏng vấn thực tập, CV, tiếng Anh',
      expertise: ['Phỏng vấn', 'CV', 'Tiếng Anh'],
      price: 20,
      rating: 4.5,
      sessionsCompleted: 8,
      verificationStatus: 'verified',
    },
  },
];

export const EMPTY_DOCUMENTS: Product[] = [];

export const DEFAULT_GUEST_USER: User = {
  id: 'guest',
  name: 'Khách',
  email: '',
  avatar: '',
  role: 'user',
  joinedDate: new Date().toISOString()
};

export const EMPTY_STATS = {
  sessions: 0,
  rating: 0,
  earnings: 0,
  activePackages: 0
};
