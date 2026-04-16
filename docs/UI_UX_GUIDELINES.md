# Quy chuẩn Thiết kế & UI/UX (Design Guidelines)

Tài liệu này định hướng cho việc xây dựng giao diện người dùng (UI) và trải nghiệm người dùng (UX) của dự án **UniShare Web**, đảm bảo tính thẩm mỹ, đồng bộ và chuyên nghiệp.

## 1. Nguyên tắc cốt lõi
- **Tối giản (Minimalism)**: Tránh quá nhiều thông tin gây nhiễu, tập trung vào nội dung chính.
- **Tính đồng nhất (Consistency)**: Mọi trang đều có cùng một phong cách thiết kế, font chữ, màu sắc và icon.
- **Phản hồi tức thì (Responsiveness)**: Giao diện phải đẹp trên mọi thiết kế màn hình (Desktop, Tablet, Mobile).
- **Trải nghiệm người dùng (UX)**: Người dùng phải dễ dàng tương tác và tìm thấy thông tin mình cần.

## 2. Màu sắc (Color Palette)
Dự án sử dụng token trong `src/app/globals.css` (`@theme`) và Tailwind CSS.
- **Primary**: `#01b5b4` (teal — class `primary` / `text-primary`, hover `primary-hover`). Thanh lịch, tin cậy; thống nhất với landing và nút `.btn-primary`.
- **Dark / nền chữ đậm**: `#0d1c2e` (`text-dark`, `bg-dark`) — tiêu đề, khối hero auth.
- **Secondary**: Emerald/Green (trạng thái thành công, badge).
- **Danger**: Rose/Red (Cảnh báo, lỗi).
- **Background**: White (light mode).
- **Text phụ**: `gray` token (`#6b7280`) và `airbnb-gray` khi cần tương phản nhẹ trên form.

## 3. Font chữ & Typography
- **Font chính**: Sans-serif (Hệ thống mặc định của Tailwind hoặc Inter).
- **Cấp bậc văn bản**:
  - `h1`: Lớn nhất, tiêu đề trang chính (text-4xl font-bold).
  - `h2`: Tiêu đề mục (text-2xl font-semibold).
  - `body`: Nội dung chính (text-base).
  - `small`: Chú thích, meta data (text-sm/xs).

## 4. Icons & Hình ảnh
- **Icon**: Chỉ sử dụng thư viện **Lucide React**. Các icon phải được chọn lọc kỹ lưỡng để dễ hiểu.
- **Hình ảnh**: 
  - Ưu tiên **`next/image`** (Next.js) cho ảnh từ mạng hoặc lớn; WebP/SVG khi có.
  - Sử dụng `aspect-ratio` hoặc `fill` + container để ảnh không bị méo.
  - Thêm thuộc tính `Alt` cho toàn bộ hình ảnh để hỗ trợ SEO và Accessibility.

## 5. Animation (Framer Motion)
- Sử dụng Animation một cách tinh tế để tăng trải nghiệm, không làm phiền người dùng.
- Các hiệu ứng thường dùng:
  - **Hover**: `whileHover={{ scale: 1.02 }}`.
  - **Tap**: `whileTap={{ scale: 0.98 }}`.
  - **Enter/Exit**: Kết hợp `LayoutGroup` hoặc `AnimatePresence`.
- Tránh các animation quá dài (quá 0.3s).

## 6. Thành phần UI (UI Components)
- **Buttons**:
  - Primary: Nền màu chính, bo góc `rounded-lg`.
  - Outline: Viền màu chính, nền trong suốt.
  - Ghost: Không có nền, chỉ hiện màu khi hover.
- **Inputs**: 
  - Có trạng thái `focus` rõ ràng.
  - Thông báo lỗi phía dưới input nếu người dùng nhập sai.
- **Modals/Drawers**: Luôn có nút đóng rõ ràng và lớp overlay làm mờ nền.

## 7. Responsive (Responsive Design)
- Thiết kế theo hướng **Mobile First**.
- Các breakpoint chính của Tailwind: `sm`, `md`, `lg`, `xl`.
- Kiểm tra lại giao diện trên các kích thước màn hình nhỏ trước khi commit code.

## 8. Khả năng truy cập (Accessibility - a11y)
- Đảm bảo độ tương phản màu sắc đủ cao cho người thị lực yếu.
- Sử dụng các thẻ HTML ngữ nghĩa (`header`, `main`, `footer`, `section`, `article`).
- Hỗ trợ phím Tab để điều hướng trong các form.
- **Skip link** tới `#main-content` (xem `AppShell`), `aria-expanded` / `aria-controls` cho menu mobile, `aria-label` cho nút chỉ có icon.
