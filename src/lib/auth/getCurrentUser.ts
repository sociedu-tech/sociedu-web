/**
 * Đọc user trên server (cookie / session). Hiện JWT nằm `localStorage` nên **chưa** dùng được trong RSC.
 * Khi backend set httpOnly cookie hoặc session, implement tại đây và gọi từ Server Components.
 */
export type ServerUser = {
  id: string;
  role: string;
  email?: string;
};

export async function getCurrentUser(): Promise<ServerUser | null> {
  return null;
}
