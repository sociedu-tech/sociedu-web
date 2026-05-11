# Kế Hoạch Tích Hợp API Frontend - Service Package & Booking Flow

## 1. Phân Tích Những Thay Đổi Từ Backend

### 1.1. Module Service Package (Catalog)
Backend đã chuyển từ việc lưu trữ gói dịch vụ đơn giản (1 flat object) sang cấu trúc phân cấp để phục vụ cho Marketplace MVP:
- **ServicePackage**: Thông tin chung (Tên, Mô tả, Category, Active/Inactive, Soft Delete - Archive).
- **ServicePackageVersion**: Các phiên bản của gói (Giá, Thời lượng, Mặc định, Trạng thái hoạt động).
- **CurriculumItem**: Nội dung chi tiết của phiên bản gói (Lộ trình, Số thứ tự, Tên buổi học).

Các Endpoint chính thay đổi:
- `GET/POST /api/v1/service-packages` & `GET/POST/PUT/DELETE /api/v1/service-packages/{id}`
- Quản lý version: `/api/v1/service-packages/{id}/versions`
- Quản lý curriculum: `/api/v1/service-packages/{id}/versions/{versionId}/curriculums`

### 1.2. Module Booking Flow
Được nâng cấp để trở thành Enterprise-ready:
- **Optimistic Locking**: Bổ sung `@Version` field vào Payload để ngăn chặn Race Condition.
- **Role-based Actions**: Chỉ có Mentor mới được quyền cập nhật link học, thay đổi lịch. Mentee chỉ được xem hoặc report.
- **Session Evidence**: Thêm chức năng tải minh chứng (evidence) cho mỗi phiên học.

---

## 2. Kế Hoạch Cập Nhật Frontend

### Bước 1: Cập Nhật Types (`src/types/index.ts`)
Loại bỏ type `MentorPackage` cũ và thay thế bằng các interfaces mới phản ánh cấu trúc DTO từ backend:

```typescript
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: string;
  // ... other fields
}

export interface ServicePackageVersion {
  id: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  isDefault: boolean;
  curriculums?: CurriculumItem[];
}

export interface CurriculumItem {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
}
```

Bổ sung trường `version: number` vào `Booking` và `BookingSession` types để phục vụ Optimistic Locking.

### Bước 2: Cập Nhật API Services
**`src/services/servicePackageService.ts` (Tạo mới):**
- Di chuyển logic gọi API gói dịch vụ từ `mentorService.ts` sang service mới này.
- Bổ sung đầy đủ các method tương ứng với `ServicePackageController` (Get, Create, Update, Delete/Toggle, Version, Curriculum).

**`src/services/bookingService.ts` (Cập nhật):**
- Đã có khung sẵn, nhưng cần review tham số truyền vào hàm `updateSession` để bắt buộc kèm `version` field.
- Bổ sung type-safety cho Request Payloads (`MenteeUpdateSessionRequest`, `MentorUpdateSessionRequest`).

### Bước 3: Nâng Cấp UI - Quản Lý Gói Dịch Vụ Của Mentor
File ảnh hưởng: `src/features/mentor/views/MentorPackagesPage.tsx` và `src/components/dashboard/mentor/MentorPackages.tsx`

- **Giao diện dạng Nested (Mẹ - Con):** 
  Thay vì form phẳng, cần làm UI dạng Accordion hoặc Master-Detail.
  1. Màn hình danh sách Service Packages (hiển thị name, status).
  2. Click vào Package mở ra Drawer/Modal để quản lý chi tiết Package.
  3. Trong chi tiết Package, có Tab "Phiên bản & Giá" -> Quản lý Versions.
  4. Trong mỗi Version, có danh sách kéo thả (drag & drop) để sắp xếp Curriculums.
- **Tính năng Soft Delete:** Thêm nút "Lưu trữ" (Archive) thay vì "Xóa", do backend đã dùng Soft Delete.
- **Tính năng Active/Inactive:** Thêm Toggle switch.

### Bước 4: Nâng Cấp UI - Booking & Lịch Học (Mentor & Mentee)
File ảnh hưởng: `src/features/dashboard/views/sessions/*` và `MentorSchedulePage.tsx`

- **Bảo Vệ Hành Động (Role Guard):** 
  - UI Ẩn các nút "Chỉnh sửa lịch", "Thêm Link Meeting", "Hoàn thành buổi học" nếu người dùng là Mentee.
  - Mentee chỉ có nút "Tham gia", "Báo cáo vắng mặt", hoặc "Hủy".
- **Gửi Optimistic Version:** Khi submit form cập nhật (vd: Cập nhật link học, Đánh dấu hoàn thành), cần phải lấy `session.version` hiện tại để gửi lên backend nhằm ngăn Race condition.
- **Upload Minh Chứng (Evidence):** Thêm popup upload file minh chứng sau khi Mentor bấm "Hoàn thành buổi học" bằng API `/api/v1/bookings/{bookingId}/sessions/{sessionId}/evidences`.

### Bước 5: Cập Nhật View Dành Cho Người Mua (Marketplace)
File ảnh hưởng: `src/features/mentor/views/MentorProfile.tsx` (Hoặc trang xem chi tiết Mentor).
- Chỉ hiển thị các Package có `isActive = true`.
- Hiển thị Default Version của Package đó (Lấy giá và thời lượng từ Default Version).
- Hiển thị Syllabus (Curriculums) như một timeline lộ trình học cho người mua xem trước.

---

## 3. Thứ Tự Ưu Tiên Triển Khai (Roadmap)
1. Cập nhật Types & Services cho đồng bộ với Backend.
2. Sửa lại luồng lấy danh sách Packages ở Marketplace để trang không bị crash do type cũ.
3. Đập đi xây lại trang `MentorPackages.tsx` để hỗ trợ cấu trúc nhiều Version và Curriculums.
4. Cập nhật trang Quản lý Booking (Dashboard) hỗ trợ `version` (Optimistic lock) và phân quyền UI.
5. Thêm tính năng đính kèm minh chứng giảng dạy (Evidence).
