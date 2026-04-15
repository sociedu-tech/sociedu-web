import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function useWsChannel<T = unknown>(channel: string, onEvent: (payload: T) => void) {
  const { subscribe } = useWebSocket();
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const unsubscribe = subscribe<T>(channel, (payload) => {
      onEventRef.current(payload);
    });

    return unsubscribe;
  }, [channel, subscribe]);
}
