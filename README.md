# OSCP — Học bảo mật từ đầu

Một website tiếng Việt dạy kiến thức bảo mật theo hướng chứng chỉ OSCP, đi từ con số 0 tới nâng cao. Mỗi bài giải thích bằng ví dụ đời thường trước, rồi tới kiến thức, kèm sơ đồ hoặc mô phỏng tương tác chạy ngay trong trình duyệt.

> **Về đạo đức và pháp lý:** tài liệu này để học cách hệ thống bị tấn công và cách bảo vệ nó. Chỉ thực hành trong lab của chính bạn hoặc nơi bạn được cho phép bằng văn bản. Mọi mô phỏng trên trang chạy hoàn toàn trong trình duyệt với dữ liệu giả, không kết nối tới hệ thống thật nào. Đọc trang **Quy tắc** trước khi học.

## Nội dung

24 bài, chia 5 cấp:

- **Cấp 0 — Khởi động:** pentest là gì, dựng lab an toàn, tư duy và phương pháp.
- **Cấp 1 — Nền tảng:** mạng (OSI, IP, subnet, TCP/UDP), DNS/HTTP, Linux, Windows, scripting.
- **Cấp 2 — Trung cấp:** thu thập thông tin, dò quét và liệt kê, lỗ hổng web, kỹ thuật xã hội, CVE/CVSS, mật khẩu.
- **Cấp 3 — Nâng cao:** leo thang đặc quyền (Linux & Windows), pivoting, Active Directory, bộ nhớ chương trình.
- **Cấp 4 — Ôn thi và nghề nghiệp:** viết báo cáo, chiến lược thi, lộ trình luyện lab.

Phần kỹ thuật nâng cao (Cấp 3) được trình bày ở **mức khái niệm**: tập trung vào cơ chế và cách phòng thủ, để người học hiểu bản chất và luyện sâu hơn một cách có trách nhiệm trong lab.

## Công nghệ

- [Astro](https://astro.build) + MDX cho nội dung
- React cho các thành phần tương tác (mô phỏng, quiz, sơ đồ)
- SVG tự vẽ cho sơ đồ, không phụ thuộc thư viện đồ hoạ nặng
- Trang tĩnh, triển khai trên GitHub Pages

## Chạy ở máy

```bash
npm install
npm run dev
```

Mở địa chỉ mà terminal in ra (thường là `http://localhost:4321/OSCP`).

## Kiểm tra và build

```bash
npm run check:content   # kiểm tra nội dung: đủ bài, không trùng mã, import đúng
npm run build           # tự chạy check:content rồi build ra thư mục dist/
```

## Triển khai

Mỗi lần đẩy lên nhánh `main`, GitHub Actions tự build và đăng lên GitHub Pages (xem `.github/workflows/deploy.yml`). Trong phần Settings → Pages của repository, chọn nguồn là **GitHub Actions**.

Trang được cấu hình cho địa chỉ `https://<tài-khoản>.github.io/OSCP/`. Nếu bạn đổi tên repository, sửa `site` và `base` trong `astro.config.mjs` cho khớp.

## Thêm hoặc sửa bài

Mỗi bài là một file `.mdx` trong `src/content/lessons/`, có phần frontmatter mô tả. Các thành phần tương tác nằm trong `src/components/sim/` và dùng được lại giữa các bài.

## Giấy phép

Xem [LICENSE](LICENSE). Đây là tài liệu học tập phi lợi nhuận. OSCP là chứng chỉ của OffSec; dự án này không liên kết với OffSec.
