# Góp phần

Cảm ơn bạn muốn đóng góp cho dự án.

## Nguyên tắc nội dung

1. **Cho người mới.** Bắt đầu bằng ví dụ đời thường, rồi mới tới thuật ngữ. Tránh viết như tài liệu kỹ thuật khô khan.
2. **Có đạo đức.** Mọi bài phải có phần "Góc phòng thủ". Các kỹ thuật tấn công trình bày ở mức giúp hiểu cơ chế và cách phòng, không phải hướng dẫn từng bước để gây hại. Mọi mô phỏng chạy trong trình duyệt với dữ liệu giả.
3. **Ngắn gọn, không nhồi nhét.** Mỗi bài tập trung vài ý chính. Thà ít mà rõ còn hơn nhiều mà rối.
4. **Sơ đồ phục vụ việc hiểu.** Chỉ thêm sơ đồ hoặc mô phỏng khi nó làm rõ cơ chế, không thêm cho đẹp.

## Cấu trúc một bài

Mỗi file `.mdx` trong `src/content/lessons/` theo mẫu:

- Frontmatter: `title`, `code` (dạng `N.N`), `level`, `summary`, `duration`, `objectives`.
- Thân bài: Hình dung trước → Kiến thức chính → Mô phỏng/Sơ đồ → Góc phòng thủ → Lỗi người mới hay gặp → Kiểm tra nhanh → Ghi nhớ.

## Trước khi gửi thay đổi

```bash
npm run check:content
npm run build
```

Cả hai phải chạy không lỗi. Nếu bạn thêm thành phần tương tác mới, nhớ truyền chỉ thị `client:visible` để nó hoạt động trên trang tĩnh.
