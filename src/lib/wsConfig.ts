import { API_BASE_URL } from '@/lib/api';
import { REALTIME_WS_PATH, userNotificationsTopic } from '@/lib/realtime/topics';

export { conversationTopic, userNotificationsTopic, REALTIME_WS_PATH } from '@/lib/realtime/topics';

/** SockJS STOMP endpoint — scheme must be http/https (SockJS upgrades internally). */
export function buildSockJsChatUrl(token: string): string {
  const base = API_BASE_URL.replace(/\/+$/, '');
  return `${base}${REALTIME_WS_PATH}?token=${encodeURIComponent(token)}`;
}

/** @deprecated Use {@link userNotificationsTopic} */
export function notificationTopicForUser(userId: string): string {
  return userNotificationsTopic(userId);
}

/** Default STOMP heartbeats (ms) — keep in sync with app.websocket.heartbeat-ms on API. */
export const STOMP_HEARTBEAT_MS = 10_000;
