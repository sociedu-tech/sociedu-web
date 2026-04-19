/**
 * Primitives UI dùng chung — ưu tiên import từ đây thay vì lặp class Tailwind.
 * Nút: `Button` + `IconButton`; khối: `Card`, `Container`, `StatTile`; nhãn: `Badge`.
 */
export { Button, buttonClassName } from './Button';
export type { AppButtonProps, ButtonSize, ButtonVariant } from './Button';
export { Badge } from './Badge';
export { Card } from './Card';
export type { CardVariant } from './Card';
export { IconButton } from './IconButton';
export { Container } from './Container';
export { StatTile } from './StatTile';
export {
  siteHeaderAuthLinkClassName,
  siteNavDesktopItemClassName,
  siteNavDesktopHashButtonClassName,
} from './siteChrome';
