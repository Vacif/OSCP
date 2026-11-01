import { useState } from 'react';

// Minh hoạ payload SQLi thật trên một ô đăng nhập giả. Không có cơ sở dữ liệu thật;
// kết quả được suy ra bằng cách phân tích câu lệnh sinh ra. Dạy để hiểu và để phòng.

interface Payload {
  name: string;
  value: string;
  kind: 'bypass' | 'probe' | 'union' | 'normal';
}

const PAYLOADS: Payload[] = [
  { name: 'Đăng nhập bình thường', value: 'an', kind: 'normal' },
  { name: "Thử phá: một dấu nháy", value: "'", kind: 'probe' },
  { name: 'Bỏ qua đăng nhập', value: "' OR '1'='1", kind: 'bypass' },
  { name: 'Bỏ qua + chú thích', value: "admin'-- -", kind: 'bypass' },
  { name: 'Rút dữ liệu bằng UNION', value: "' UNION SELECT username,password FROM users-- -", kind: 'union' },
];

const TEMPLATE_A = "SELECT * FROM users WHERE user = '";
const TEMPLATE_B = "' AND pass = '...'";

function analyse(p: Payload) {
  const query = TEMPLATE_A + p.value + TEMPLATE_B;
  switch (p.kind) {
    case 'normal':
      return { query, result: 'Truy vấn chỉ khớp khi mật khẩu đúng. Đây là hành vi mong đợi.', tone: 'good' as const };
    case 'probe':
      return {
        query,
        result:
          'Dấu nháy làm câu lệnh sai cú pháp → cơ sở dữ liệu báo lỗi. Nếu website hiện thông báo lỗi SQL ra màn hình, đó là dấu hiệu rõ ràng rằng đầu vào chưa được xử lý an toàn.',
        tone: 'warn' as const,
      };
    case 'bypass':
      return {
        query,
        result:
          'Điều kiện luôn đúng (OR \'1\'=\'1\'), hoặc phần kiểm tra mật khẩu bị biến thành chú thích (-- -). Câu lệnh trả về người dùng mà không cần đúng mật khẩu → đăng nhập bị vượt qua.',
        tone: 'bad' as const,
      };
    case 'union':
      return {
        query,
        result:
          'UNION gắn thêm một truy vấn lấy thẳng username và password từ bảng users, trộn vào kết quả trả về. Đây là cách dữ liệu nhạy cảm bị rút ra. (Cần số cột khớp mới chạy; kẻ tấn công dò số cột trước bằng ORDER BY.)',
        tone: 'bad' as const,
      };
  }
}

export default function SqliPlayground() {
  const [pi, setPi] = useState(0);
  const p = PAYLOADS[pi];
  const a = analyse(p);

  return (
    <div className="sim sqlix">
      <p className="sim-title">Sân chơi payload SQLi (ô đăng nhập giả)</p>
      <p className="muted small">
        Lập trình viên nối thẳng tên đăng nhập vào câu lệnh:
        <code> "{TEMPLATE_A}" + user + "{TEMPLATE_B}"</code>. Chọn thử một payload để thấy câu lệnh thật và hậu quả.
      </p>
      <div className="tabs" role="group" aria-label="Chọn payload">
        {PAYLOADS.map((x, i) => (
          <button key={i} type="button" className="btn" aria-pressed={i === pi} onClick={() => setPi(i)}>
            {x.name}
          </button>
        ))}
      </div>
      <p className="sqlix-label">Người dùng gõ vào ô tên đăng nhập:</p>
      <pre className="sqlix-input"><code>{p.value}</code></pre>
      <p className="sqlix-label">Câu lệnh thực sự chạy:</p>
      <pre className="sqlix-query"><code>{a.query}</code></pre>
      <div className={`sim-note ${a.tone === 'bad' ? 'bad-bg' : a.tone === 'good' ? 'good-bg' : 'warn-bg'}`} aria-live="polite">
        {a.result}
      </div>
    </div>
  );
}
