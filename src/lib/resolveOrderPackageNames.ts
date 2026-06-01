import { orderService } from '@/services/orderService';

const packageNameCache = new Map<string, string>();

const isIdFallbackLabel = (label?: string | null): boolean => {
  if (!label?.trim()) return true;
  return /^Gói dịch vụ · /i.test(label.trim());
};

export async function resolveOrderPackageName(orderId: string): Promise<string | null> {
  const cached = packageNameCache.get(orderId);
  if (cached) return cached;

  try {
    const order = await orderService.getOrderById(orderId);
    const name = order.packageName?.trim();
    if (name) {
      packageNameCache.set(orderId, name);
      return name;
    }
  } catch {
    // ignore — fallback label on caller
  }
  return null;
}

export async function resolveOrderPackageNames(orderIds: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(orderIds.filter(Boolean))];
  await Promise.all(unique.map((id) => resolveOrderPackageName(id)));
  return Object.fromEntries(
    unique
      .map((id) => [id, packageNameCache.get(id)] as const)
      .filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

export function pickPackageLabel(
  orderId: string | null | undefined,
  fallbackLabel: string | undefined,
  names: Record<string, string>,
  orderPackageName?: string | null,
): string {
  const fromOrder = orderPackageName?.trim();
  if (fromOrder) return fromOrder;
  if (orderId && names[orderId]) return names[orderId];
  if (fallbackLabel && !isIdFallbackLabel(fallbackLabel)) return fallbackLabel.trim();
  if (orderId && packageNameCache.has(orderId)) return packageNameCache.get(orderId)!;
  return 'Gói dịch vụ';
}
