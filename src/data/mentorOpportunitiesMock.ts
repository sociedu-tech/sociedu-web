/** Dữ liệu demo pipeline cơ hội dự án — dùng chung trang Cơ hội & tổng quan mentor. */

export type SuggestedProject = {
  id: string;
  title: string;
  menteeName: string;
  summary: string;
  tags: string[];
  matchPercent: number;
  postedAt: string;
  durationLabel: string;
};

export type StudentRequest = {
  id: string;
  title: string;
  menteeName: string;
  summary: string;
  menteeMessage: string;
  tags: string[];
  postedAt: string;
  durationLabel: string;
};

export const MOCK_SUGGESTED: SuggestedProject[] = [
  {
    id: 'p-open-1',
    title: 'Xây MVP dashboard analytics cho startup',
    menteeName: 'Nguyễn Minh K.',
    summary: 'Cần mentor full-stack giúp kiến trúc API + chart real-time, deploy AWS.',
    tags: ['Lập trình web', 'DevOps & Cloud', 'Startup & Product'],
    matchPercent: 94,
    postedAt: '16/04/2026',
    durationLabel: '2–3 tháng',
  },
  {
    id: 'p-open-2',
    title: 'Khóa luận: mô hình gợi ý nội dung',
    menteeName: 'Trần Thu H.',
    summary: 'Tập trung NLP tiếng Việt, baseline và đánh giá offline.',
    tags: ['Machine Learning', 'Data Science', 'Khóa luận / Đồ án'],
    matchPercent: 89,
    postedAt: '14/04/2026',
    durationLabel: '3–4 tháng',
  },
  {
    id: 'p-open-3',
    title: 'Chuẩn bị portfolio UI/UX + case study',
    menteeName: 'Lê Gia B.',
    summary: 'Đã có wireframe, cần critique flow và design system gọn cho handoff dev.',
    tags: ['UI/UX Design', 'Kỹ năng mềm'],
    matchPercent: 76,
    postedAt: '12/04/2026',
    durationLabel: '3–5 tuần',
  },
];

export const MOCK_REQUESTS: StudentRequest[] = [
  {
    id: 'req-1',
    title: 'Đồ án tốt nghiệp — review luận văn & slide',
    menteeName: 'Phạm Quỳnh N.',
    summary: 'Ngành CNTT, hạn nộp cuối tháng 6; cần mentor rà soát chương 2–3 và góp ý slide.',
    menteeMessage:
      'Em đã xem profile thầy/cô và muốn được đồng hành cố định 1 buổi/tuần. Em có thể gửi thêm outline trong tuần này.',
    tags: ['Khóa luận / Đồ án', 'Lập trình web'],
    postedAt: '17/04/2026',
    durationLabel: '6–8 tuần',
  },
  {
    id: 'req-2',
    title: 'Ôn thi phỏng vấn intern Frontend',
    menteeName: 'Hoàng Anh T.',
    summary: 'Đã có 2 mini project React; cần mock interview + feedback code.',
    menteeMessage: 'Em gửi request trực tiếp từ trang dự án của em — mong anh/chị nhận lịch tối cuối tuần.',
    tags: ['Lập trình web', 'Kỹ năng mềm'],
    postedAt: '15/04/2026',
    durationLabel: '2–3 tuần',
  },
];

export function findOpportunity(id: string): { title: string; menteeName: string } | undefined {
  const s = MOCK_SUGGESTED.find((x) => x.id === id);
  if (s) return { title: s.title, menteeName: s.menteeName };
  const r = MOCK_REQUESTS.find((x) => x.id === id);
  if (r) return { title: r.title, menteeName: r.menteeName };
  return undefined;
}

export const MENTOR_OPPORTUNITY_BASE_COUNTS = {
  suggested: MOCK_SUGGESTED.length,
  requests: MOCK_REQUESTS.length,
} as const;
