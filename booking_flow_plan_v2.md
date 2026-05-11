# Booking Flow — Implementation Plan v2

> Cập nhật từ v1, tích hợp đầy đủ 23 điểm review.

---

## 1. Kiến trúc thư mục

```text
src/features/booking/
├── api/                          # API service functions (booking-specific)
│   └── bookingFlowApi.ts
├── hooks/                        # React Query hooks
│   ├── useAvailability.ts
│   ├── useBookingMutations.ts
│   └── usePackagesForBooking.ts
├── services/                     # Business logic helpers
│   └── slotService.ts
├── constants/
│   ├── bookingStates.ts          # State machine definition
│   └── bookingConfig.ts          # Timeouts, limits, defaults
├── utils/
│   ├── timezoneHelper.ts
│   ├── slotFormatter.ts
│   └── bookingValidation.ts
├── schemas/
│   └── bookingFormSchema.ts      # Zod validation
├── store/
│   └── useBookingStore.ts        # Zustand + persist
├── components/
│   ├── BookingFlowShell.tsx       # Responsive: Dialog (desktop) / Drawer (mobile)
│   ├── BookingStepper.tsx
│   ├── OrderSummaryPanel.tsx      # Global sidebar summary (mọi step)
│   ├── CloseConfirmDialog.tsx
│   ├── skeletons/
│   │   ├── PackageSkeleton.tsx
│   │   ├── CalendarSkeleton.tsx
│   │   ├── SlotSkeleton.tsx
│   │   └── SummarySkeleton.tsx
│   └── steps/
│       ├── PackageSelectionStep.tsx
│       ├── ScheduleSelectionStep.tsx
│       ├── BookingDetailsStep.tsx
│       └── BookingResultStep.tsx   # Handles PENDING / SUCCESS / FAILED
└── types/
    └── index.ts
```

---

## 2. Booking State Machine (#19)

Tất cả transitions được define trước, tránh spaghetti state.

```typescript
// constants/bookingStates.ts
export type BookingFlowState =
  | 'IDLE'
  | 'SELECTING_PACKAGE'
  | 'SELECTING_SLOT'
  | 'FILLING_DETAILS'
  | 'SUBMITTING'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'EXPIRED'
  | 'ERROR';

export const TRANSITIONS: Record<BookingFlowState, BookingFlowState[]> = {
  IDLE:               ['SELECTING_PACKAGE'],
  SELECTING_PACKAGE:  ['SELECTING_SLOT', 'IDLE'],
  SELECTING_SLOT:     ['FILLING_DETAILS', 'SELECTING_PACKAGE', 'IDLE'],
  FILLING_DETAILS:    ['SUBMITTING', 'SELECTING_SLOT', 'IDLE'],
  SUBMITTING:         ['PAYMENT_PENDING', 'ERROR', 'FILLING_DETAILS'],
  PAYMENT_PENDING:    ['PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'EXPIRED'],
  PAYMENT_SUCCESS:    ['IDLE'],
  PAYMENT_FAILED:     ['FILLING_DETAILS', 'IDLE'],
  EXPIRED:            ['SELECTING_SLOT', 'IDLE'],
  ERROR:              ['FILLING_DETAILS', 'SELECTING_SLOT', 'IDLE'],
};

export function canTransition(from: BookingFlowState, to: BookingFlowState) {
  return TRANSITIONS[from]?.includes(to) ?? false;
}
```

---

## 3. Zustand Store + Persist (#2, #3)

```typescript
// store/useBookingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingFlowState } from '../constants/bookingStates';

interface BookingStore {
  // --- UI ---
  isOpen: boolean;
  flowState: BookingFlowState;

  // --- Selections ---
  mentorId?: string;
  selectedPackageId?: string;
  selectedVersionId?: string;   // version display strategy (#8)
  selectedDate?: string;        // ISO date
  selectedTimeSlot?: string;    // ISO datetime
  timezone: string;             // (#20)

  // --- Draft & Payment ---
  draftBookingId?: string;      // (#9)
  paymentUrl?: string;
  isSubmitting: boolean;

  // --- Form ---
  bookingNotes?: string;
  questions?: string;
  portfolioUrl?: string;
  attachmentIds: string[];

  // --- Dirty tracking (#5) ---
  hasUnsavedChanges: boolean;

  // --- Auth resume (#6) ---
  pendingBookingIntent?: { mentorId: string; packageId?: string };

  // --- Actions ---
  open: (mentorId: string, packageId?: string) => void;
  close: () => void;
  transitionTo: (state: BookingFlowState) => void;
  setPackage: (packageId: string, versionId?: string) => void;
  setSchedule: (date: string, slot: string) => void;
  setDraft: (draftId: string) => void;
  setPayment: (url: string) => void;
  markDirty: () => void;
  setPendingIntent: (intent: { mentorId: string; packageId?: string } | undefined) => void;
  reset: () => void;
}

const INITIAL: Partial<BookingStore> = {
  isOpen: false,
  flowState: 'IDLE',
  mentorId: undefined,
  selectedPackageId: undefined,
  selectedVersionId: undefined,
  selectedDate: undefined,
  selectedTimeSlot: undefined,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  draftBookingId: undefined,
  paymentUrl: undefined,
  isSubmitting: false,
  bookingNotes: undefined,
  questions: undefined,
  portfolioUrl: undefined,
  attachmentIds: [],
  hasUnsavedChanges: false,
  pendingBookingIntent: undefined,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...(INITIAL as BookingStore),

      open: (mentorId, packageId) =>
        set({
          isOpen: true,
          mentorId,
          selectedPackageId: packageId,
          flowState: 'SELECTING_PACKAGE',
          pendingBookingIntent: undefined,
        }),

      close: () => set({ isOpen: false }),

      transitionTo: (next) => {
        const { flowState } = get();
        // Validate via state machine
        if (canTransition(flowState, next)) {
          set({ flowState: next });
        } else {
          console.warn(`Invalid transition: ${flowState} → ${next}`);
        }
      },

      setPackage: (packageId, versionId) =>
        set({ selectedPackageId: packageId, selectedVersionId: versionId, hasUnsavedChanges: true }),

      setSchedule: (date, slot) =>
        set({ selectedDate: date, selectedTimeSlot: slot, hasUnsavedChanges: true }),

      setDraft: (draftId) => set({ draftBookingId: draftId }),
      setPayment: (url) => set({ paymentUrl: url }),
      markDirty: () => set({ hasUnsavedChanges: true }),

      setPendingIntent: (intent) => set({ pendingBookingIntent: intent }),

      reset: () => set(INITIAL as BookingStore),
    }),
    {
      name: 'booking-flow',
      partialize: (state) => ({
        // Chỉ persist những field cần thiết cho recovery
        mentorId: state.mentorId,
        selectedPackageId: state.selectedPackageId,
        selectedVersionId: state.selectedVersionId,
        selectedDate: state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
        draftBookingId: state.draftBookingId,
        flowState: state.flowState,
        timezone: state.timezone,
        pendingBookingIntent: state.pendingBookingIntent,
      }),
    }
  )
);
```

---

## 4. Responsive Modal / Drawer (#4)

```
Desktop (≥768px)  → Dialog (centered modal, max-w-4xl)
Mobile  (<768px)  → Drawer (full-screen bottom sheet)
```

**Implementation**: Dùng CSS media query + conditional render. Cùng 1 `BookingFlowShell` component, render `<dialog>` trên desktop và slide-up panel trên mobile. Không cần thư viện ngoài — dùng native `<dialog>` + Framer Motion cho animation.

---

## 5. Close Confirmation — Dirty Check (#5)

```typescript
// Chỉ show confirm khi hasUnsavedChanges === true
const handleClose = () => {
  if (store.hasUnsavedChanges) {
    setShowConfirm(true); // render CloseConfirmDialog
  } else {
    store.reset();
    store.close();
  }
};
```

---

## 6. Auth Resume Flow (#6)

```
User chưa login → click "Kết nối"
  → store.setPendingIntent({ mentorId })
  → open login popup
  → login success → AuthContext callback
  → check pendingBookingIntent
  → if exists → store.open(intent.mentorId, intent.packageId)
```

Thêm vào `AuthContext.tsx`:
```typescript
// Sau login thành công, check pending booking
const onLoginSuccess = () => {
  const intent = useBookingStore.getState().pendingBookingIntent;
  if (intent) {
    useBookingStore.getState().open(intent.mentorId, intent.packageId);
  }
};
```

---

## 7. Package Filtering — Marketplace Safety (#7)

```typescript
// hooks/usePackagesForBooking.ts
export const usePackagesForBooking = (mentorId: string) =>
  useQuery({
    queryKey: ['booking-packages', mentorId],
    queryFn: () => mentorService.getPackages(mentorId),
    select: (packages) =>
      packages.filter((p) => p.isActive && !p.isArchived),
    enabled: !!mentorId,
  });
```

---

## 8. Version Display Strategy (#8)

**Chọn Option B (MVP)**: Auto lấy default version.

```typescript
const getDisplayVersion = (pkg: ServicePackage): ServicePackageVersion | null => {
  if (!pkg.versions?.length) return null;
  return pkg.versions.find(v => v.isDefault && v.isActive)
    ?? pkg.versions.find(v => v.isActive)
    ?? null;
};
```

UI hiển thị: `Tên gói — {duration} phút — {price} VNĐ`

> **Sau MVP**: chuyển sang Option A, cho user chọn version (30 phút / 60 phút).

---

## 9. Draft Booking & Slot Hold (#9)

```
Step 2 complete → call createDraftBooking API
  → Backend: hold slot + trả draftBookingId
  → Store: setDraft(draftBookingId)
  → Transition: SELECTING_SLOT → FILLING_DETAILS
```

```typescript
// api/bookingFlowApi.ts
export const bookingFlowApi = {
  createDraft: async (data: CreateDraftRequest) => {
    const res = await api.post<{ draftBookingId: string }>('/api/v1/bookings/draft', data);
    return res.data!;
  },
  confirmBooking: async (draftId: string, details: BookingDetails) => {
    const res = await api.post(`/api/v1/bookings/${draftId}/confirm`, details);
    return res.data!;
  },
  cancelDraft: async (draftId: string) => {
    await api.delete(`/api/v1/bookings/draft/${draftId}`);
  },
  createPaymentSession: async (bookingId: string) => {
    const res = await api.post<{ paymentUrl: string }>(`/api/v1/payments/booking/${bookingId}/session`);
    return res.data!;
  },
  verifyPayment: async (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    const res = await api.get(`/api/v1/payments/vnpay/return?${qs}`);
    return res.data;
  },
};
```

---

## 10. Slot Refresh Strategy (#10)

```typescript
// hooks/useAvailability.ts
export const useAvailability = (mentorId: string, date?: string) =>
  useQuery({
    queryKey: ['availability', mentorId, date],
    queryFn: () => bookingFlowApi.getAvailability(mentorId, date!),
    enabled: !!mentorId && !!date,
    staleTime: 30_000,       // 30s trước khi refetch
    refetchInterval: 60_000, // auto refresh mỗi 60s
  });
```

Khi change package → invalidate availability:
```typescript
queryClient.invalidateQueries({ queryKey: ['availability', mentorId] });
```

---

## 11. Calendar — Backend Slots Only (#11)

> **KHÔNG tự generate slots ở frontend.**

```typescript
// Backend trả:
interface AvailableSlot {
  startTime: string;   // ISO datetime
  endTime: string;
  available: boolean;
}

// Frontend chỉ render:
slots.filter(s => s.available).map(slot => <SlotButton ... />)
```

---

## 12. Form Validation Schema (#12)

```typescript
// schemas/bookingFormSchema.ts
import { z } from 'zod';

export const bookingFormSchema = z.object({
  goals: z.string()
    .min(10, 'Mô tả mục tiêu tối thiểu 10 ký tự')
    .max(1000, 'Tối đa 1000 ký tự'),
  questions: z.string()
    .max(2000, 'Tối đa 2000 ký tự')
    .optional(),
  portfolioUrl: z.string()
    .url('Link không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
```

> **Lưu ý**: Cần cài thêm `zod` và `react-hook-form` + `@hookform/resolvers`.

---

## 13. Attachment — Upload After Booking (#13)

```
Flow: Submit booking → booking created → upload attachments → link to booking
```

Lý do:
- User có thể abandon → tránh orphan files
- Đơn giản hơn cho MVP
- Attachment là optional, không block booking creation

---

## 14. Order Summary — Global Sidebar (#14)

`OrderSummaryPanel` hiển thị ở **mọi step** (desktop: sidebar bên phải).

```
┌─────────────────────────────────────┐
│  Step Content          │  Summary   │
│  (PackageSelection)    │  --------  │
│  (Schedule)            │  Mentor    │
│  (Details)             │  Package   │
│                        │  Time      │
│                        │  Price     │
└─────────────────────────────────────┘
```

Mobile: Summary collapse thành accordion ở top.

---

## 15. Payment States (#15)

```typescript
// BookingResultStep handles 3 substates:
type PaymentStatus = 'PAYMENT_PENDING' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED';
```

- **PENDING**: Spinner + "Đang chờ xác nhận thanh toán..." + polling
- **SUCCESS**: Checkmark + booking summary + "Xem lịch hẹn"
- **FAILED**: Error + "Thử lại" / "Chọn phương thức khác"

---

## 16. Mutation Split (#16)

```typescript
// hooks/useBookingMutations.ts
export const useCreateDraft = () => useMutation({ mutationFn: bookingFlowApi.createDraft });
export const useConfirmBooking = () => useMutation({ mutationFn: ... });
export const useCancelDraft = () => useMutation({ mutationFn: ... });
export const useCreatePaymentSession = () => useMutation({ mutationFn: ... });
export const useVerifyPayment = () => useMutation({ mutationFn: ... });
```

---

## 17. Skeleton Loading (#17)

Mỗi step có skeleton riêng:

| Step | Skeleton |
|------|----------|
| Package Selection | 3 card placeholders với animated shimmer |
| Calendar | Month grid skeleton + slot list skeleton |
| Slot List | 6 pill-shaped shimmer buttons |
| Order Summary | Text line placeholders |

---

## 18. Booking Conflict Recovery (#18)

```typescript
// Khi tạo draft hoặc confirm bị 409:
onError: (err) => {
  if (err.status === 409) {
    toast.error('Khung giờ vừa được đặt bởi người khác. Vui lòng chọn lại.');
    queryClient.invalidateQueries({ queryKey: ['availability', mentorId] });
    store.transitionTo('SELECTING_SLOT');
    store.setSchedule('', ''); // clear selection
  }
}
```

---

## 20. Timezone Notice (#20)

```typescript
// utils/timezoneHelper.ts
export const getTimezoneLabel = (tz: string): string => {
  const offset = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  }).formatToParts().find(p => p.type === 'timeZoneName')?.value;
  return `Giờ hiển thị theo ${offset ?? tz}`;
};
```

Hiển thị ở ScheduleSelectionStep: `⏰ Giờ hiển thị theo GMT+7`

---

## 21. Route-Based Recovery (#21)

Sync booking step với query param:

```
/profile/[mentorId]?booking=2
```

```typescript
// Trong BookingFlowShell:
useEffect(() => {
  const step = searchParams.get('booking');
  if (step && store.flowState !== 'IDLE') {
    // Restore step from URL
  }
}, [searchParams]);

// Khi chuyển step:
router.replace(`?booking=${stepNumber}`, { shallow: true });

// Khi close:
router.replace(pathname, { shallow: true });
```

Browser back → step lùi thay vì close hẳn modal.

---

## 22. Phân pha triển khai

### Phase A — Foundation (Store + Shell + Machine)

| # | Task | File |
|---|------|------|
| A1 | Booking types mới | `features/booking/types/index.ts` |
| A2 | State machine constants | `features/booking/constants/bookingStates.ts` |
| A3 | Booking config (timeouts, limits) | `features/booking/constants/bookingConfig.ts` |
| A4 | Zustand store + persist | `features/booking/store/useBookingStore.ts` |
| A5 | BookingFlowShell (Dialog/Drawer responsive) | `features/booking/components/BookingFlowShell.tsx` |
| A6 | BookingStepper component | `features/booking/components/BookingStepper.tsx` |
| A7 | CloseConfirmDialog | `features/booking/components/CloseConfirmDialog.tsx` |
| A8 | OrderSummaryPanel (global) | `features/booking/components/OrderSummaryPanel.tsx` |
| A9 | Gắn vào ProfileHeader (nút Kết nối) | `components/profile/ProfileHeader.tsx` |
| A10 | Install dependencies: `zustand`, `zod`, `react-hook-form`, `@hookform/resolvers` | `package.json` |

**Deliverable**: Click "Kết nối" → modal/drawer mở → stepper hiện → đóng có confirm.

---

### Phase B — Package & Availability

| # | Task | File |
|---|------|------|
| B1 | Booking flow API service | `features/booking/api/bookingFlowApi.ts` |
| B2 | usePackagesForBooking hook (filter active) | `features/booking/hooks/usePackagesForBooking.ts` |
| B3 | PackageSelectionStep + PackageSkeleton | `features/booking/components/steps/` |
| B4 | Timezone helper | `features/booking/utils/timezoneHelper.ts` |
| B5 | useAvailability hook (refetch strategy) | `features/booking/hooks/useAvailability.ts` |
| B6 | ScheduleSelectionStep + CalendarSkeleton + SlotSkeleton | `features/booking/components/steps/` |
| B7 | createDraftBooking mutation (slot hold) | `features/booking/hooks/useBookingMutations.ts` |
| B8 | Query keys update | `constants/queryKeys.ts` |

**Deliverable**: Chọn package → chọn slot → draft booking created → slot held.

---

### Phase C — Details & Payment

| # | Task | File |
|---|------|------|
| C1 | Zod form schema | `features/booking/schemas/bookingFormSchema.ts` |
| C2 | BookingDetailsStep (react-hook-form + zod) | `features/booking/components/steps/` |
| C3 | confirmBooking mutation | hook update |
| C4 | createPaymentSession mutation | hook update |
| C5 | BookingResultStep (PENDING/SUCCESS/FAILED) | `features/booking/components/steps/` |
| C6 | Payment callback page | `app/payment/callback/page.tsx` |
| C7 | verifyPayment mutation + polling | hook update |

**Deliverable**: Full booking flow end-to-end với payment.

---

### Phase D — UX Hardening

| # | Task |
|---|------|
| D1 | Auth resume flow (pendingBookingIntent) |
| D2 | Conflict recovery (409 → refetch → re-select) |
| D3 | Route-based recovery (query params sync) |
| D4 | Mobile responsive polish (Drawer animations) |
| D5 | Loading skeleton polish |
| D6 | Attachment upload (post-booking) |
| D7 | Error boundary cho booking flow |
| D8 | Accessibility (keyboard nav, focus trap, aria) |

---

## 23. Dependencies cần cài

```bash
npm install zustand zod react-hook-form @hookform/resolvers
```

> `date-fns` đã có sẵn. `@tanstack/react-query` đã có sẵn.

---

## 24. Checklist tổng hợp — Trước khi code

| # | Item | Status |
|---|------|--------|
| 1 | Thư mục features/booking/ với subfolders | ⬜ |
| 2 | State machine definition | ⬜ |
| 3 | Zustand store + persist | ⬜ |
| 4 | Draft booking flow design | ⬜ |
| 5 | Slot hold logic (API contract) | ⬜ |
| 6 | Payment state handling (3 states) | ⬜ |
| 7 | Auth resume flow | ⬜ |
| 8 | Timezone strategy (auto-detect) | ⬜ |
| 9 | Route recovery (query params) | ⬜ |
| 10 | Conflict recovery UX (409) | ⬜ |
| 11 | Responsive modal/drawer | ⬜ |
| 12 | Form validation schema | ⬜ |
| 13 | Version display strategy (B → A) | ⬜ |
| 14 | Marketplace filter (active + !archived) | ⬜ |
| 15 | Install zustand, zod, rhf | ⬜ |

---

> **Bước tiếp theo**: Bắt đầu Phase A — tạo types, state machine, store, và modal shell.
