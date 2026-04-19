export type MentorOrderUrgency = 'Cao' | 'Bình thường' | 'Thấp';

export type MentorOrderRow = {
  id: string;
  mentee: string;
  package: string;
  amount: number;
  date: string;
  status: string;
  urgency: MentorOrderUrgency;
};

export const MENTOR_ORDERS_MOCK: MentorOrderRow[] = [
  {
    id: 'ORD-001',
    mentee: 'Nguyễn Văn A',
    package: 'Tư vấn sự nghiệp IT',
    amount: 500000,
    date: '02/04/2026',
    status: 'Chờ xác nhận',
    urgency: 'Cao',
  },
  {
    id: 'ORD-002',
    mentee: 'Trần Thị B',
    package: 'Review Code React',
    amount: 300000,
    date: '01/04/2026',
    status: 'Đã xác nhận',
    urgency: 'Bình thường',
  },
  {
    id: 'ORD-003',
    mentee: 'Lê Văn C',
    package: 'Khóa học Design UI/UX',
    amount: 1500000,
    date: '30/03/2026',
    status: 'Hoàn thành',
    urgency: 'Thấp',
  },
  {
    id: 'ORD-004',
    mentee: 'Phạm Minh D',
    package: 'Tư vấn học bổng',
    amount: 200000,
    date: '28/03/2026',
    status: 'Đã hủy',
    urgency: 'Bình thường',
  },
];
