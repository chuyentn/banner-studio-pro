# Architecture

## Tổng quan cấu trúc

```
src/
  routes/
    __root.tsx
    index.tsx
    studio.tsx
    history.tsx
    settings.tsx
    pricing.tsx
    login.tsx
  lib/
    auth-context.tsx
    firebase.ts
    storage.ts
    banner-api.ts
    typography.ts
    utils.ts
  components/
    AppHeader.tsx
    ImageDropzone.tsx
    ui/...
```

## Các module core

### `src/routes/__root.tsx`
- Entry point của ứng dụng.
- Chứa shell component, mobile navigation, `AuthProvider` và `Toaster`.
- Xử lý meta tags và global layout.

### `src/routes/index.tsx`
- Landing page marketing.
- Không ảnh hưởng logic core Studio.

### `src/routes/studio.tsx`
- Workflow chính của app.
- Quản lý trạng thái upload, prompt, ratio, quality, typography và biến thể.
- Gọi `generateVariants` từ `src/lib/banner-api.ts`.
- Hỗ trợ prompt-only generation khi người dùng chỉ nhập prompt.
- Lưu lịch sử vào localStorage sau khi tạo ảnh thành công.

### `src/routes/settings.tsx`
- Giao diện cấu hình API/credential.
- Lưu cấu hình vào `localStorage` và Firebase.
- Cho phép test kết nối API.

### `src/routes/history.tsx`
- Hiển thị lịch sử banner tạo.
- Xóa nội dung lịch sử.
- Tải ảnh từ kết quả đã lưu.

### `src/routes/login.tsx`
- Login / register với email và Google.
- Reset password.
- Chuyển hướng sau khi đăng nhập.

## Logic lưu trữ và auth

### `src/lib/auth-context.tsx`
- Cung cấp context auth cho toàn app.
- Theo dõi state Firebase auth.
- Tạo hooks `useAuth()`.

### `src/lib/firebase.ts`
- Khởi tạo Firebase app và auth.
- Xử lý sign in/out, register, reset password.
- Lưu profile và user settings vào Realtime Database.

### `src/lib/storage.ts`
- Lưu API settings và lịch sử banner vào `localStorage`.
- Chỉ giữ tối đa 30 mục lịch sử.
- Có validator dự án `ProjectState`.

### `src/lib/banner-api.ts`
- Xử lý upload ảnh, build prompt và gọi API tạo ảnh.
- Hỗ trợ OpenAI, Google Labs và Coach.io API.
- Cung cấp `generateVariants()` và `regenerateOne()`.
- Xử lý polling status và timeout.

### `src/components/ImageDropzone.tsx`
- Upload ảnh, drag-drop, paste clipboard.
- Tối ưu UX cho thêm/xóa ảnh.

## Công nghệ chính
- React 19
- TypeScript
- Vite
- TanStack Router
- Firebase Auth + Realtime Database
- Tailwind CSS
- Sonner toast
- Radix UI components
- OpenAI / Labs / custom image generation API

## Các điểm cần chú ý khi nâng cấp
- `studio.tsx` chứa nhiều state và phải giữ flow rõ ràng.
- `banner-api.ts` có nhiều đường đi khác nhau cho OpenAI vs Labs vs Coach.io.
- `settings.tsx` cần đồng bộ `localStorage` và Firebase nhưng không phải là logic auth cốt lõi.
- `history.tsx` hiện chưa đồng bộ cloud, chỉ client-side.
