import type { User, Product } from '@/types';

export const EMPTY_MENTORS: User[] = [];

export const EMPTY_DOCUMENTS: Product[] = [];

export const DEFAULT_GUEST_USER: User = {
  id: 'guest',
  name: 'Khách',
  email: '',
  avatar: '',
  role: 'buyer',
  joinedDate: new Date().toISOString()
};

export const EMPTY_STATS = {
  sessions: 0,
  rating: 0,
  earnings: 0,
  activePackages: 0
};
