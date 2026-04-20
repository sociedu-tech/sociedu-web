import type { Conversation } from '@/features/dashboard/chat/types';

const PLACEHOLDER_IMG = 'https://picsum.photos/seed/chat1/400/300';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Minh Trần',
    roleLabel: 'Mentor · CNTT',
    lastMessage: 'Mình đã gửi bạn outline buổi sau nhé.',
    time: '10:42',
    unread: 2,
    messages: [
      { id: 'm1', role: 'them', text: 'Chào bạn, mình nhận được yêu cầu kèm đồ án web.', time: '09:12' },
      { id: 'm2', role: 'me', text: 'Dạ em chào anh. Em đang làm phần API NestJS.', time: '09:18' },
      {
        id: 'm3',
        role: 'them',
        text: 'Ok, gửi mình repo hoặc zip phần backend để review.',
        time: '09:22',
        attachments: [
          { id: 'a1', kind: 'file', name: 'checklist-review.pdf' },
          { id: 'a2', kind: 'image', name: 'sơ đồ API.png', url: PLACEHOLDER_IMG },
        ],
      },
      { id: 'm4', role: 'me', text: 'Em gửi link GitHub trong phần dự án rồi ạ.', time: '09:35' },
      {
        id: 'm5',
        role: 'them',
        text: 'Mình đã gửi bạn outline buổi sau nhé.',
        time: '10:42',
        attachments: [{ id: 'a3', kind: 'image', name: 'outline.png', url: 'https://picsum.photos/seed/outline/480/320' }],
      },
    ],
  },
  {
    id: '2',
    name: 'Hệ thống',
    roleLabel: 'Thông báo',
    lastMessage: 'Buổi học ngày mai 19:00 đã được xác nhận.',
    time: 'Hôm qua',
    messages: [
      { id: 's1', role: 'them', text: 'Buổi học ngày mai 19:00 đã được xác nhận.', time: '18:05' },
      { id: 's2', role: 'them', text: 'Nhắc: bạn có báo cáo chưa nộp trước deadline 20/4.', time: '18:06' },
    ],
  },
  {
    id: '3',
    name: 'Lan Phạm',
    roleLabel: 'Mentor · Thiết kế',
    lastMessage: 'Portfolio em ổn rồi, thêm 1 case study nữa là đủ.',
    time: 'T3',
    messages: [
      { id: 'l1', role: 'them', text: 'Chào em, mình xem qua Figma của em rồi.', time: '14:00' },
      {
        id: 'l2',
        role: 'me',
        text: 'Em cảm ơn chị ạ. Em đính kèm thêm moodboard.',
        time: '14:02',
        attachments: [{ id: 'l2a', kind: 'image', name: 'moodboard.jpg', url: 'https://picsum.photos/seed/mood/400/400' }],
      },
      { id: 'l3', role: 'them', text: 'Portfolio em ổn rồi, thêm 1 case study nữa là đủ.', time: '14:10' },
    ],
  },
];
