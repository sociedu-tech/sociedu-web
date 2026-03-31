# Quy chuẩn Lập trình (Coding Conventions)

Tài liệu này quy định các chuẩn mực lập trình cho dự án **UniShare Web**. Mục tiêu là đảm bảo mã nguồn đồng nhất, dễ đọc, dễ bảo trì và giảm thiểu lỗi.

## 1. Ngôn ngữ & Công nghệ
- **TypeScript**: Bắt buộc sử dụng TypeScript cho toàn bộ logic.
- **React**: Sử dụng React 19 (Functional Components & Hooks).
- **Styling**: Tailwind CSS (v4).
- **Icons**: Lucide React.
- **Animations**: Framer Motion (`motion`).

## 2. Quy tắc đặt tên (Naming Conventions)

### 2.1 Tập tin & Thư mục
- **Component**: PascalCase (ví dụ: `Navbar.tsx`, `SidebarItem.tsx`).
- **Hook**: camelCase, bắt đầu bằng `use` (ví dụ: `useAuth.ts`, `useFetchData.ts`).
- **Thư mục**: kebab-case hoặc lowercase (ví dụ: `auth-context`, `services`).
- **Asset**: kebab-case (ví dụ: `logo-primary.png`).

### 2.2 Biến & Hàm
- **Biến/Hàm**: camelCase (ví dụ: `userData`, `setIsLoading`, `handleLogin`).
- **Hằng số (Global Constants)**: UPPER_SNAKE_CASE (ví dụ: `API_URL`, `MAX_RETRIES`).
- **Boolean**: Sử dụng tiền tố `is`, `has`, `should` (ví dụ: `isActive`, `hasPermission`).

### 2.3 Interface & Type
- **Interface/Type**: PascalCase.
- Không dùng tiền tố `I` hoặc `T` (Nên dùng `User` thay vì `IUser`).
- Ưu tiên dùng `interface` cho các đối tượng và `type` cho các union type hoặc primitive type.

## 3. Quy chuẩn React Component

### 3.1 Cấu trúc file Component
```tsx
// 1. Imports (External -> Project -> Internal)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

// 2. Types/Interfaces
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// 3. Component Definition
export const CustomButton = ({ label, onClick }: ButtonProps) => {
  // 3.1 Hooks
  const { user } = useAuth();

  // 3.2 Handlers
  const internalClick = () => {
    console.log('Button clicked by', user?.name);
    onClick();
  };

  // 3.3 Render
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={internalClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
    >
      {label}
    </motion.button>
  );
};
```

### 3.2 Props
- Luôn định nghĩa Type/Interface cho Props.
- Sử dụng destructuring cho Props để dễ theo dõi.
- Tránh dùng `any`. Nếu không biết kiểu, hãy dùng `unknown`.

## 4. Quản lý Trạng thái (State Management)
- **Local State**: `useState`.
- **Global State**: `React Context` (đặt trong `src/context`).
- **API Cache**: Cân nhắc sử dụng React Query (nếu dự án mở rộng).

## 5. Styling (Tailwind CSS)
- Ưu tiên viết trực tiếp trong `className`.
- Sử dụng `clsx` hoặc `tailwind-merge` khi cần xử lý class có điều kiện:
  ```tsx
  import { cn } from '@/lib/utils'; // Giả sử có hàm cn kết hợp clsx & tailwind-merge
  
  <div className={cn("base-class", isActive && "active-class")} />
  ```
- Không sử dụng Inline CSS trừ trường hợp bất khả kháng (ví dụ: tính toán vị trí động).

## 6. Xử lý Lỗi & Logging
- Sử dụng `try-catch` cho các logic không đồng bộ (API calls).
- Luôn thông báo cho người dùng qua Toast/Alert thay vì chỉ `console.log`.
- Kiểm tra dữ liệu hợp lệ (zod/yup) trước khi gửi lên Backend.
