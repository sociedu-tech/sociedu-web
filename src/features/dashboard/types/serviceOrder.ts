export type ServiceOrderDto = {
  id: string;
  buyerId?: string;
  serviceId?: string;
  packageName?: string;
  mentorId?: string;
  buyerLabel?: string;
  status: string;
  totalAmount: number;
  paidAt?: string | null;
  createdAt?: string | null;
  paymentExpiresAt?: string | null;
  canPay?: boolean;
  paymentUrl?: string | null;
};

export type UserOrderRow = {
  id: string;
  packageLabel: string;
  amount: number;
  createdAt: string;
  paidAt: string | null;
  paymentExpiresAt: string | null;
  status: string;
  statusLabel: string;
  canPay: boolean;
};
