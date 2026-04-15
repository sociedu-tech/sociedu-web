export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'buyer' | 'seller' | 'admin' | 'mentor';
  coverImage?: string;
  bio?: string;
  joinedDate: string;
  rating?: number;
  totalSales?: number;
  // CV Fields
  university?: string;
  major?: string;
  year?: number;
  gpa?: number;
  experience?: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  researchProjects?: {
    title: string;
    role: string;
    year: string;
    description: string;
  }[];
  skills?: string[];
  achievements?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  recommendations?: {
    id: string;
    user: string;
    avatar: string;
    role: string;
    text: string;
    date: string;
  }[];
  // Mentor Fields
  mentorInfo?: {
    headline: string;
    expertise: string[];
    price: number;
    rating: number;
    sessionsCompleted: number;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    packages?: MentorPackage[];
  };
}

export interface MentorPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'Giáo trình' | 'Source Code';
  image: string;
  stock: number;
  university: string;
  subject: string;
  description: string;
  rating: number;
  sellerId: string;
  reviews?: Review[];
  status: 'pending' | 'approved' | 'rejected';
  updateRequest?: Partial<Product>;
}

export interface Order {
  id: number;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  customerName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
