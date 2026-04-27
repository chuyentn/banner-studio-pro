# Banner Studio Overview

## Mục tiêu sản phẩm
Banner Studio là nền tảng SaaS tạo banner quảng cáo AI, tập trung vào:

- Tạo banner tự động từ prompt và ảnh tham chiếu.
- Hỗ trợ nhiều tỷ lệ ảnh (ratio) và chất lượng (quality).
- Cung cấp workflow nhanh cho marketers, designers và agency.
- Lưu lịch sử tạo ảnh để tham chiếu và tải về.

## Tính năng chính

### Landing + Marketing
- Trang landing giới thiệu sản phẩm.
- Trang pricing/plans marketing gói dịch vụ.

### Authentication
- Email/password đăng nhập và đăng ký.
- Google Sign-In.
- Reset password.

### Studio
- Upload ảnh inspiration và ảnh sản phẩm.
- Chọn ratio, quality, typography.
- Tạo nhiều biến thể banner cùng lúc.
- Regenerate từng ảnh nếu cần.

### Settings
- Cấu hình API Key / Bearer Token / Cookie.
- Kiểm tra kết nối API.
- Lưu cấu hình vào `localStorage` và đồng bộ với Firebase khi login.

### History
- Lưu lịch sử tạo banner trên client.
- Hiển thị thumbnail, thông tin prompt, ratio và quality.
- Xóa từng mục hoặc xóa toàn bộ lịch sử.

## Luồng chính

1. Người dùng truy cập landing page.
2. Đăng nhập/đăng ký vào hệ thống.
3. Vào `Studio` để upload ảnh và nhập prompt.
4. Thiết lập ratio, quality, typography.
5. Nhấn tạo banner.
6. Xem kết quả, tải ảnh và lưu lịch sử.

## Mục tiêu tài liệu này
- Giúp người mới nhanh chóng hiểu app.
- Hướng dẫn audit MVP và roadmap phát triển.
- Tạo nền tảng để nâng cấp app hiệu quả.
