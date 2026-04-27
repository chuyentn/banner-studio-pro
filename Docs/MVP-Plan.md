# MVP Plan

## MVP Goal
Phiên bản SaaS Banner Studio cần vận hành ngay, giúp khách hàng:

- Đăng nhập nhanh và truy cập workspace bảo mật.
- Upload ảnh inspiration / product dễ dàng.
- Tạo banner AI theo tỷ lệ, chất lượng và kiểu chữ.
- Lưu lịch sử kết quả để xem lại và tải về.
- Cấu hình API / auth mode và kiểm tra kết nối đúng.
- Có feedback rõ ràng khi tạo banner thành công hoặc lỗi.

## Priority Tasks

### 1. Core Studio Flow
- [ ] Hoàn thiện form upload ảnh inspiration, ảnh sản phẩm và ảnh logo/KOL.
- [ ] Hỗ trợ drag-drop, click để chọn file và paste ảnh clipboard.
- [ ] Hiển thị số lượng ảnh hiện có và giới hạn tối đa.
- [ ] Cho phép xóa ảnh từng ảnh ngay trong dropzone.
- [ ] Hiển thị input prompt, brand name, product info rõ ràng.
- [ ] Cho phép chọn ratio, quality, typography.
- [ ] Tự động điều chỉnh quality hợp lệ khi ratio thay đổi.
- [ ] Tắt nút tạo banner nếu thiếu ảnh đầu vào hoặc API chưa cấu hình.
- [ ] Dùng `generateVariants` để tạo batch biến thể.
- [ ] Hiển thị trạng thái từng slot: uploading / generating / done / error.
- [ ] Cho phép regenerate từng banner với điều chỉnh prompt.
- [ ] Hiển thị toast thông báo thành công / lỗi rõ ràng.
- [ ] Lưu kết quả thành công vào history ngay sau khi tạo.

### 2. Authentication
- [ ] Đảm bảo login và đăng ký email/password hoạt động ổn định.
- [ ] Hỗ trợ đăng nhập Google Sign-In.
- [ ] Cho phép reset password qua email.
- [ ] Hiển thị spinner/loading khi auth đang kiểm tra.
- [ ] Redirect người dùng chưa auth về `/login` khi truy cập `/studio`, `/history`, `/settings`.
- [ ] Hiển thị thông tin user và cho phép logout.
- [ ] Bảo vệ route quan trọng bằng auth guard.

### 3. Settings & API
- [x] Hiển thị lựa chọn auth mode: `apikey`, `bearer`, `cookie`.
- [x] Cung cấp input nhập API Key, Access Token, Cookie, endpoint và model.
- [x] Lưu cấu hình API vào `localStorage` ngay khi bấm Save.
- [ ] Test kết nối API với kết quả `ok / lỗi` và thông báo chi tiết.
- [ ] Cung cấp thông báo lỗi xác thực, lỗi CORS, lỗi endpoint không hợp lệ.
- [x] Đồng bộ cấu hình settings với Firebase khi người dùng đã login.
- [x] Giữ giá trị mặc định hợp lý cho mỗi auth mode.
- [ ] **Optimize auth mode**: Recommend `bearer` token over `cookie` for SPA (see `Auth-Token-vs-Cookie-Analysis.md`).
- [ ] Add retry logic + timeout handling for API calls (currently missing).
- [ ] Implement token refresh on 401 error instead of forcing manual re-login.

### 4. History
- [ ] Lưu metadata banner: `brand`, `prompt`, `ratio`, `quality`, `thumb`, `createdAt`, `results`.
- [ ] Giới hạn history tối đa 30 mục để tránh quá quota localStorage.
- [ ] Hiển thị trang lịch sử với thumbnail, thông tin và thời gian tạo.
- [ ] Cho phép xóa từng mục history.
- [ ] Cho phép xóa toàn bộ lịch sử với cảnh báo xác nhận.
- [ ] Cho phép tải từng ảnh từ kết quả history.
- [ ] Hiển thị trạng thái khi chưa có lịch sử nào.

### 5. Onboarding / UX polish
- [ ] Hiển thị hint prompt / tooltip cho mỗi style và typography.
- [ ] Giải thích nhanh các option `ratio` và `quality`.
- [ ] Cải thiện button action bằng disabled state, loading state và hover.
- [ ] Thêm feedback visual rõ cho các bước upload và generate.
- [ ] Giữ layout responsive cho mobile và desktop.
- [ ] Dùng toast/Internal notification để báo lỗi success, warning, info.
- [ ] Tối ưu hiển thị error message trực quan, tránh thông báo kỹ thuật.

### 6. Quality & reliability
- [ ] Kiểm tra kỹ `banner-api.ts` với tất cả đường dẫn OpenAI / Labs / Coach.io.
- [x] Hỗ trợ tạo banner chỉ với prompt khi chưa có ảnh đầu vào.
- [ ] Đảm bảo upload ảnh base64 / URL / file hoạt động đúng.
- [ ] Xử lý timeout và retry khi API không phản hồi kịp.
- [ ] Đảm bảo prompt builder tạo hướng dẫn chất lượng cho AI.
- [ ] Thêm fallback khi API trả về lỗi hoặc không có URL ảnh.
- [ ] Kiểm tra `saveHistoryItem` tránh quá lớn và hạ bớt kết quả nếu cần.

### 7. Documentation & release
- [ ] Cập nhật `Docs/` với overview, architecture và MVP plan.
- [ ] Viết checklist hướng dẫn QA và developer onboarding.
- [ ] Ghi rõ cách build, chạy và deploy app.
- [ ] Đảm bảo tài liệu dễ đọc cho người mới vào repo.

## Success Criteria
- [ ] Người dùng có thể đăng nhập và vào `/studio` thành công.
- [ ] Người dùng có thể upload ảnh và tạo banner AI.
- [ ] Người dùng có thể xem history và tải ảnh.
- [ ] Người dùng có thể cấu hình API, test kết nối và lưu.
- [ ] App hiển thị trạng thái rõ ràng khi tạo banner và khi lỗi.
- [ ] Core workflow ổn định cho khách hàng SaaS.

## Future improvements
- Billing/subscription flow.
- Cloud history & project storage.
- Team account / workspace sharing.
- Usage/quota dashboard.
- Save preset templates và export project.
- Brand kit / luxury fashion preset.

## Notes for developers
- Ưu tiên giữ workflow đơn giản, không thêm feature nặng ngay.
- Ưu tiên sửa bugs hiển thị và UX trước khi mở rộng tính năng.
- Giữ code `studio.tsx` rõ ràng: state upload / prompt / generate / slots.
- Tránh thay đổi quá nhiều logic API cùng lúc.
- Nếu cần hiện thực feature mới, cập nhật ngay tài liệu `Docs/`.
