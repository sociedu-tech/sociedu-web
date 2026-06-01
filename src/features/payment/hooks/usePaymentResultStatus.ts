'use client';

import { useEffect, useMemo, useState } from 'react';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import {
  isFailedLikeStatus,
  isPaidLikeStatus,
  isUrlPaymentFailure,
  isUrlPaymentSuccess,
  normalizePaymentStatus,
} from '@/features/payment/lib/paymentResultStatus';

const MAX_SYNC_ATTEMPTS = 5;
const SYNC_INTERVAL_MS = 1200;

type ResolveSource = 'url' | 'order' | 'payment' | 'unknown';

export function usePaymentResultStatus(
  orderId: string | null,
  urlStatus: string | null,
  urlCode: string | null,
  rawParams?: Record<string, string> | null,
) {
  const urlSuccess = isUrlPaymentSuccess(urlStatus, urlCode);
  const urlFailure = isUrlPaymentFailure(urlStatus, urlCode);

  const [initialLoading, setInitialLoading] = useState(Boolean(orderId) && !urlSuccess && !urlFailure);
  const [syncing, setSyncing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [syncAttempts, setSyncAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setInitialLoading(false);
      setSyncing(false);
      return;
    }

    let cancelled = false;
    let timer: number | null = null;
    let attempts = 0;

    const resolveStatuses = async (): Promise<{ order: string | null; payment: string | null }> => {
      let order: string | null = null;
      let payment: string | null = null;

      try {
        const row = await orderService.getOrderById(orderId);
        order = normalizePaymentStatus(row.status) || null;
      } catch {
        // best-effort
      }

      try {
        const row = await paymentService.getPaymentStatusByOrderId(orderId);
        payment = normalizePaymentStatus((row as { status?: string })?.status) || null;
      } catch {
        // best-effort
      }

      return { order, payment };
    };

    const shouldStopSync = (order: string | null, payment: string | null) => {
      if (isPaidLikeStatus(order) || isPaidLikeStatus(payment)) return true;
      if (isFailedLikeStatus(order) || isFailedLikeStatus(payment)) return true;
      if (urlFailure) return true;
      return attempts >= MAX_SYNC_ATTEMPTS;
    };

    const run = async () => {
      attempts += 1;
      if (cancelled) return;

      const hasVnPay = rawParams && Object.keys(rawParams).some((key) => key.startsWith('vnp_'));

      if (attempts === 1) {
        if (hasVnPay) {
          setSyncing(true);
          try {
            await paymentService.handleVNPayReturn(rawParams);
          } catch (err) {
            console.error('Error processing VNPay return:', err);
          }
        } else {
          const needBackgroundSync = urlSuccess || (!urlSuccess && !urlFailure);
          if (needBackgroundSync && !urlSuccess && !urlFailure) {
            setInitialLoading(true);
          } else if (urlSuccess) {
            setSyncing(true);
          }
        }
      }

      const { order, payment } = await resolveStatuses();
      if (cancelled) return;

      setOrderStatus(order);
      setPaymentStatus(payment);
      setSyncAttempts(attempts);
      setInitialLoading(false);

      if (shouldStopSync(order, payment)) {
        setSyncing(false);
        return;
      }

      setSyncing(true);
      timer = window.setTimeout(run, SYNC_INTERVAL_MS);
    };

    void run();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, urlFailure, urlSuccess, rawParams]);

  const paid = useMemo(() => {
    if (urlSuccess) return true;
    return isPaidLikeStatus(orderStatus) || isPaidLikeStatus(paymentStatus);
  }, [orderStatus, paymentStatus, urlSuccess]);

  const failed = useMemo(() => {
    if (paid) return false;
    if (urlFailure) return true;
    return isFailedLikeStatus(orderStatus) || isFailedLikeStatus(paymentStatus);
  }, [orderStatus, paid, paymentStatus, urlFailure]);

  const resolvedSource: ResolveSource = useMemo(() => {
    if (urlSuccess || urlFailure) return 'url';
    if (isPaidLikeStatus(orderStatus) || isFailedLikeStatus(orderStatus)) return 'order';
    if (isPaidLikeStatus(paymentStatus) || isFailedLikeStatus(paymentStatus)) return 'payment';
    return 'unknown';
  }, [orderStatus, paymentStatus, urlFailure, urlSuccess]);

  const expired = normalizePaymentStatus(orderStatus) === 'expired';

  const syncTimedOut =
    urlSuccess &&
    syncAttempts >= MAX_SYNC_ATTEMPTS &&
    !isPaidLikeStatus(orderStatus) &&
    !isPaidLikeStatus(paymentStatus);

  return {
    initialLoading,
    syncing,
    paid,
    failed,
    expired,
    orderStatus,
    paymentStatus,
    resolvedSource,
    syncDone: !syncing && !initialLoading,
    syncTimedOut,
  };
}
