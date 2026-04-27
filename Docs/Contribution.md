# Contribution Guidelines

## Mục đích
Tài liệu này hướng dẫn cách đọc, cập nhật và mở rộng Banner Studio nhanh nhất.

## Khi thay đổi mã
- Đọc `Docs/Overview.md` và `Docs/Architecture.md` trước.
- Nếu sửa `studio.tsx`, kiểm tra cả `banner-api.ts` và `storage.ts`.
- Nếu sửa authentication, kiểm tra `auth-context.tsx`, `firebase.ts`, và các route bảo vệ.

## Cập nhật tài liệu
- Thêm nội dung vào file thích hợp trong `Docs/`.
- Giữ nội dung ngắn gọn, rõ ràng và tiếng Việt dễ hiểu.
- Nếu thêm feature mới, cập nhật `MVP-Plan.md` với task và trạng thái.

## Kiểm tra sau khi chỉnh sửa
- Chạy `npm run dev` và kiểm tra luồng chính.
- Test các route: `/login`, `/studio`, `/history`, `/settings`.
- Kiểm thử chức năng upload/tạo banner và history.

## Quy ước đặt tên
- File component: `PascalCase.tsx`.
- Module logic: `camel-case.ts` hoặc `kebab-case.ts`.
- Docs: `Docs/*.md`.

## Tài liệu bổ sung
- Nếu cần note thêm về API endpoint, tạo file `Docs/API.md`.
- Nếu cần roadmap chi tiết, tạo file `Docs/Roadmap.md`.
