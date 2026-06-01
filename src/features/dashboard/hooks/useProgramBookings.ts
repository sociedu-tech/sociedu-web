'use client';



import { useCallback, useEffect, useMemo, useState } from 'react';

import { bookingService } from '@/services/bookingService';

import { mapBookingsToProgramItems } from '@/features/dashboard/lib/bookingMappers';

import type { BookingApi, BookingProgramItem } from '@/features/dashboard/types/booking';

import { usePaginatedList } from '@/hooks/usePaginatedList';

import { pickDisplayName, resolveUserNames } from '@/lib/resolveUserNames';

import { pickPackageLabel, resolveOrderPackageNames } from '@/lib/resolveOrderPackageNames';
import { getProgramChatPeerId } from '@/features/dashboard/lib/programChat';



export function useProgramBookings(perspective: 'buyer' | 'mentor') {

  const paginated = usePaginatedList<unknown>({

    fetchPage: useCallback(

      (page, size) =>

        perspective === 'mentor'

          ? bookingService.listAsMentor(page, size)

          : bookingService.listAsBuyer(page, size),

      [perspective],

    ),

    resetKey: perspective,

  });



  const baseItems = useMemo(() => {

    return mapBookingsToProgramItems(paginated.items as BookingApi[], perspective);

  }, [paginated.items, perspective]);



  const [items, setItems] = useState<BookingProgramItem[]>([]);



  useEffect(() => {

    let cancelled = false;

    const peerIds = baseItems

      .map((item) => (perspective === 'mentor' ? item.buyerId : item.mentorId))

      .filter(Boolean) as string[];

    const orderIds = baseItems.map((item) => item.orderId).filter(Boolean) as string[];



    const enrich = async () => {

      const [names, packageNames] = await Promise.all([

        peerIds.length ? resolveUserNames(peerIds) : Promise.resolve({}),

        orderIds.length ? resolveOrderPackageNames(orderIds) : Promise.resolve({}),

      ]);

      if (cancelled) return;

      setItems(

        baseItems.map((item) => {

          const peerId = perspective === 'mentor' ? item.buyerId : item.mentorId;

          const counterpartyLabel = pickDisplayName(peerId, item.counterpartyLabel, names);

          const packageLabel = pickPackageLabel(item.orderId, item.packageLabel, packageNames);
          const next = {
            ...item,
            counterpartyLabel,
            packageLabel,
            sessionRows: item.sessionRows.map((row) => ({
              ...row,
              counterparty: counterpartyLabel,
            })),
          };
          return {
            ...next,
            chatPeerId: getProgramChatPeerId(next),
          };

        }),

      );

    };



    void enrich();

    return () => {

      cancelled = true;

    };

  }, [baseItems, perspective]);



  return {

    items,

    loading: paginated.loading,

    error: paginated.error,

    page: paginated.page,

    size: paginated.size,

    total: paginated.total,

    totalPages: paginated.totalPages,

    setPage: paginated.setPage,

    setSize: paginated.setSize,

    refresh: paginated.refresh,

  };

}



/** @deprecated Use useProgramBookings('mentor') */

export function useMentorTeachingBookings() {

  return useProgramBookings('mentor');

}


