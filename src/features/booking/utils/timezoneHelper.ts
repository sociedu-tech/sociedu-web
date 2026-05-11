/**
 * Timezone helper — detect user timezone and format display label.
 */

/** Lấy timezone label cho UI, ví dụ: "GMT+7" */
export function getTimezoneOffsetLabel(tz?: string): string {
  try {
    const timezone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());

    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value ?? timezone;
  } catch {
    return 'GMT+7';
  }
}

/** Hiển thị notice cho user */
export function getTimezoneNotice(tz?: string): string {
  const label = getTimezoneOffsetLabel(tz);
  return `Giờ hiển thị theo ${label}`;
}
