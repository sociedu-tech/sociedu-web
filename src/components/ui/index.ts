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
export { PageLoadingState } from './PageLoadingState';
export type { PageLoadingVariant } from './PageLoadingState';
export { LoadingSkeleton } from './LoadingSkeleton';
export { DataGate } from './DataGate';
export { LoadingSpinner } from './LoadingSpinner';
export {
  siteHeaderAuthLinkClassName,
  siteNavDesktopItemClassName,
  siteNavDesktopHashButtonClassName,
} from './siteChrome';
