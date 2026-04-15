import { useCallback, useState } from 'react';
import { useWsChannel } from '@/hooks/useWsChannel';
import { useWebSocket } from '@/hooks/useWebSocket';

export interface PaymentEvent {
  orderId?: string | number;
  status?: string;
  amount?: number;
  transactionId?: string;
  [key: string]: unknown;
}

export function usePaymentEvents() {
  const { send } = useWebSocket();
  const [latestPaymentEvent, setLatestPaymentEvent] = useState<PaymentEvent | null>(null);

  useWsChannel<PaymentEvent>('payment', (event) => {
    setLatestPaymentEvent(event);
  });

  const subscribePayments = useCallback(() => {
    send({ action: 'subscribe', channel: 'payment' });
  }, [send]);

  return {
    latestPaymentEvent,
    subscribePayments,
  };
}
