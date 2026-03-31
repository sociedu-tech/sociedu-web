# Cấu trúc Thư mục (Project Structure)

Tài liệu này giải thích ý nghĩa của các thư mục trong dự án **UniShare Web**, giúp các thành viên biết nơi đặt file mới một cách đồng nhất.

## 1. Tổng quan
Dự án được xây dựng với Vite + React + TypeScript. Các file mã nguồn chính nằm trong thư mục `src/`.

## 2. Chi tiết Thư mục (src/)

### 2.1 components/
Chứa các React Components có thể tái sử dụng.
- **ui/**: Các thành phần UI cơ bản, nguyên tử (như Button, Input, Modal, v.v.).
- **admin/**: Các component dành riêng cho giao diện quản trị.
- **mentor/**: Các component cho Mentor.
- **profile/**: Các component cho trang thông tin cá nhân.
- Các file chung như `Navbar.tsx`, `Footer.tsx` đặt trực tiếp tại `components/`.

### 2.2 pages/
Chứa các trang (routes) chính của ứng dụng. Mỗi file tương ứng với một đường dẫn (URL).
- **auth/**: Các trang liên quan đến đăng nhập, đăng ký, quên mật khẩu.
- Ví dụ: `HomePage.tsx`, `AdminDashboard.tsx`, `MentorMarketplace.tsx`.

### 2.3 context/
Chứa các React Context để quản lý Global State (như `AuthContext.tsx` để quản lý thông tin người dùng đang đăng nhập).

### 2.4 hooks/
Chứa các Custom Hooks (logic dùng chung giữa các component).
- Ví dụ: `useAuth.ts`, `useFetch.ts`, `useWindowSize.ts`.

### 2.5 services/
Chứa các file xử lý dữ liệu từ bên ngoài (API calls, Firebase, LocalStorage).
- Ví dụ: `apiService.ts`, `firebaseConfig.ts`.

### 2.6 lib/
Chứa các thư viện bên thứ ba hoặc các helper function dùng chung cho toàn dự án.
- Ví dụ: `utils.ts` (chứa hàm xử lý chuỗi, định dạng ngày tháng, v.v.).

### 2.7 mocks/
Chứa dữ liệu giả (mock data) phục vụ cho quá trình phát triển khi chưa có API thật.

### 2.8 các file khác trong src/
- **App.tsx**: File gốc chứa cấu trúc routing và các provider bao bọc.
- **main.tsx**: Điểm bắt đầu (entry point) của ứng dụng React.
- **index.css**: Các cấu cấu hình CSS toàn cục (Tailwind layers).
- **types.ts**: Nơi tập trung định nghĩa các interface/type dùng chung toàn dự án.

## 3. Các File Cấu hình Gốc (Root)
- **public/**: Chứa các asset tĩnh (hình ảnh, logo, favicon) không qua quá trình build của Vite.
- **package.json**: Quản lý các dependencies và scripts của dự án.
- **vite.config.ts**: Cấu hình của Vite (plugins, aliases, dev server).
- **tsconfig.json**: Cấu hình của TypeScript.
- **server.ts**: File chạy server (Development/Production).
- **.env / .env.example**: Quản lý các biến môi trường (API Key, URL Backend).

## 4. Quy tắc bổ sung
- Luôn giữ cấu trúc thư mục sạch sẽ.
- Xóa các file không còn sử dụng.
- Đừng tạo ra các file quá lớn (trên 300 dòng), hãy cố gắng chia nhỏ thành các component con.
