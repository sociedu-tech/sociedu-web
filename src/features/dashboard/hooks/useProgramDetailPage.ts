'use client';

import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { orderService } from '@/services/orderService';
import { mapBookingsToProgramItems } from '@/features/dashboard/lib/bookingMappers';
import type { BookingApi, BookingProgramItem } from '@/features/dashboard/types/booking';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import { pickDisplayName, resolveUserNames } from '@/lib/resolveUserNames';
import { pickPackageLabel, resolveOrderPackageName } from '@/lib/resolveOrderPackageNames';
import { getProgramChatPeerId } from '@/features/dashboard/lib/programChat';

async function enrichProgramItem(
  raw: BookingProgramItem,
  perspective: 'buyer' | 'mentor',
  orderPackageName?: string | null,
): Promise<BookingProgramItem> {
  const peerId = perspective === 'mentor' ? raw.buyerId : raw.mentorId;
  let counterpartyLabel = raw.counterpartyLabel;
  if (peerId) {
    const names = await resolveUserNames([peerId]);
    counterpartyLabel = pickDisplayName(peerId, raw.counterpartyLabel, names);
  }

  let packageLabel = raw.packageLabel;
  if (raw.orderId) {
    const names = orderPackageName
      ? { [raw.orderId]: orderPackageName }
      : await resolveOrderPackageNames([raw.orderId]).catch(() => ({}));
    packageLabel = pickPackageLabel(raw.orderId, raw.packageLabel, names, orderPackageName);
  }

  const next: BookingProgramItem = {
    ...raw,
    counterpartyLabel,
    packageLabel,
    sessionRows: raw.sessionRows.map((row) => ({
      ...row,
      counterparty: counterpartyLabel,
    })),
  };
  return {
    ...next,
    chatPeerId: getProgramChatPeerId(next),
  };
}

export function useProgramDetailPage(bookingId: string, perspective: 'buyer' | 'mentor') {
  const [item, setItem] = useState<BookingProgramItem | null>(null);
  const [order, setOrder] = useState<ServiceOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);

    try {
      const booking = (await bookingService.getById(bookingId)) as BookingApi;
      const mapped = mapBookingsToProgramItems([{ ...booking, id: bookingId }], perspective)[0];
      if (!mapped) {
        setError('Không tìm thấy lộ trình.');
        setItem(null);
        return;
      }

      let orderData: ServiceOrderDto | null = null;
      if (mapped.orderId) {
        try {
          orderData = await orderService.getOrderById(mapped.orderId);
          setOrder(orderData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Không tải được thông tin đơn hàng.');
        }
      } else {
        setOrder(null);
      }

      const enriched = await enrichProgramItem(
        mapped,
        perspective,
        orderData?.packageName ?? (mapped.orderId ? await resolveOrderPackageName(mapped.orderId) : null),
      );
      setItem(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết lộ trình.');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId, perspective]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { item, order, loading, error, refresh };
}

/** @deprecated Use useProgramDetailPage(id, 'mentor') */
export function useMentorTeachingDetailPage(bookingId: string) {
  return useProgramDetailPage(bookingId, 'mentor');
}
