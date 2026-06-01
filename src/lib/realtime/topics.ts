/** STOMP destinations — mirror {@code RealtimeTopics} on sociedu-api. */

export const API_V1_PREFIX = '/api/v1';

/** Same host/port as REST — {@code NEXT_PUBLIC_API_BASE_URL + REALTIME_WS_PATH} */
export const REALTIME_WS_PATH = `${API_V1_PREFIX}/ws`;

export const conversationTopic = (conversationId: string): string =>
  `/topic/conversations/${conversationId}`;

export const userNotificationsTopic = (userId: string): string =>
  `/topic/users/${userId}/notifications`;
