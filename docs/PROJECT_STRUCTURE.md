# Cấu trúc thư mục (Project Structure)

Tài liệu mô tả cách tổ chức **UniShare Web / Mentoree** — ứng dụng **Next.js** (App Router) + TypeScript.

## 1. Tổng quan

- **Framework**: Next.js, thư mục ứng dụng: [`src/app/`](../src/app/).
- **UI theo route**: Mỗi URL được định nghĩa bởi `page.tsx`; layout dùng chung hoặc lồng nhau qua `layout.tsx`.
- **View lớn**: Nội dung màn hình thường nằm trong [`src/views/`](../src/views/) và được import từ `page.tsx` (route file giữ mỏng).

## 2. `src/app/` — Routing (App Router)

| Đường dẫn | Ý nghĩa |
|-----------|---------|
| `layout.tsx` | Layout gốc: font, `Providers`, `AppShell`. |
| `globals.css` | Token Tailwind v4 (`@theme`), utility `.btn-primary`, v.v. |
| `page.tsx` | Trang chủ `/`. |
| `(auth)/` | **Route group** (không thêm segment vào URL): đăng nhập, đăng ký, xác minh email. |
| `(mentee)/` | Trang dành học viên: marketplace mentor, hồ sơ, tài liệu, báo cáo, … |
| `dashboard/` | **Khu vực đăng nhập** `/dashboard/*` — gom route theo nhóm: `(user)/page.tsx` (trang chủ `/dashboard`), `(mentor)/*` (gói dịch vụ, lịch, …), `(admin)/admin` (quản trị). Meta route + role trong [`dashboardRoutes.ts`](../src/app/dashboard/dashboardRoutes.ts). URL cũ `/mentor/*`, `/admin` redirect trong `next.config.ts`. |

**Ghi chú**: Tên thư mục trong ngoặc `(tên)` là *route group* — chỉ để nhóm file, **không** xuất hiện trong URL.

## 3. `src/views/`

- Trang full-screen hoặc màn phức tạp: `HomePage`, `LandingPage`, `LoginPage`, …
- **Theo role (sau đăng nhập)**: `views/admin/` (quản trị), `views/mentor/` (mentor), `views/user/` (học viên / `buyer`), orchestrator `views/dashboard/DashboardHomePage.tsx` cho `/dashboard`.
- Có thể tách phụ (`views/landing/landingContent.ts`) để giảm kích thước file.

## 4. `src/components/`

- **`components/ui/`**: Thành phần nhỏ tái sử dụng (loading, lỗi, …).
- **`components/layout/`**: `AppShell` (Navbar + Footer + skip link), v.v.
- **`components/dashboard/`** (admin, mentor), **`components/profile/`**: Theo khu vực nghiệp vụ; màn sau đăng nhập ưu tiên gom dưới `dashboard/`.
- **`Navbar.tsx`**, **`Footer.tsx`**: Chrome chung trang công khai.

## 5. `src/context/`, `src/hooks/`, `src/services/`, `src/lib/`, `src/types/`

- **context**: Auth, User, Cart, WebSocket (tuỳ dự án).
- **hooks**: Logic tái sử dụng (`useAuth`, `useMentorData`, …).
- **services**: Gọi API, tách khỏi component.
- **lib**: `api.ts`, `utils.ts`, helper chung.
- **types**: Kiểu TypeScript dùng chung.

## 6. Quy tắc đặt file mới

1. **Route mới** → thêm `src/app/.../page.tsx` (đặt trong group `(mentee)` / `(auth)` / … cho đúng vai trò).
2. **UI phức tạp** → tạo component trong `views/` hoặc `components/` và import vào `page.tsx`.
3. **Gọi API** → thêm hàm trong `services/`, không gọi trực tiếp `fetch` rải rác trong nhiều component nếu có thể tái sử dụng.
4. Giữ file không quá dài; tách section (như `landing/*`) khi cần.

## 7. Cấu hình & môi trường

- [`next.config.ts`](../next.config.ts): `images.remotePatterns` cho `next/image` (Unsplash, pravatar, …).
- [`.env.example`](../.env.example): Biến môi trường (URL API, v.v.).

## 8. Không còn dùng (lịch sử)

Dự án **không** dùng Vite + `App.tsx` + `main.tsx` như bản mô tả cũ. Nếu thấy tài liệu ngoài repo nói về `pages/` (Pages Router) thuần — codebase hiện tại dùng **`src/app`** (App Router).
