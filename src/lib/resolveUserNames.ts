import { userService } from '@/services/userService';

const nameCache = new Map<string, string>();

const isPlaceholderLabel = (label?: string | null): boolean => {
  if (!label?.trim()) return true;
  return /^(Học viên|Người dùng)\s*#/i.test(label.trim());
};

/** Lấy tên hiển thị từ profile; cache trong phiên trang. */
export async function resolveUserName(userId: string): Promise<string> {
  const cached = nameCache.get(userId);
  if (cached) return cached;

  try {
    const profile = await userService.getUserProfile(userId);
    const name = profile?.name?.trim() || 'Người dùng';
    nameCache.set(userId, name);
    return name;
  } catch {
    nameCache.set(userId, 'Người dùng');
    return 'Người dùng';
  }
}

export async function resolveUserNames(userIds: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  await Promise.all(unique.map((id) => resolveUserName(id)));
  return Object.fromEntries(unique.map((id) => [id, nameCache.get(id) ?? 'Người dùng']));
}

/** Ưu tiên tên thật từ cache/API; bỏ qua nhãn dạng `#uuid`. */
export function pickDisplayName(
  userId: string | null | undefined,
  fallbackLabel: string | undefined,
  names: Record<string, string>,
): string {
  if (userId && names[userId]) return names[userId];
  if (fallbackLabel && !isPlaceholderLabel(fallbackLabel)) return fallbackLabel.trim();
  if (userId && nameCache.has(userId)) return nameCache.get(userId)!;
  return fallbackLabel?.trim() || 'Người dùng';
}
