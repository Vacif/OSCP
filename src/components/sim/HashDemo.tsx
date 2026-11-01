import { useEffect, useState } from 'react';

async function sha256(text: string): Promise<string> {
  if (!globalThis.crypto?.subtle) return '(trình duyệt không hỗ trợ Web Crypto)';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function strength(pw: string) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  const exp = pw.length && pool ? pw.length * Math.log10(pool) : 0;
  return { pool, exp };
}

// Chỉ là ước lượng thô: giả định mỗi ký tự chọn ngẫu nhiên, điều mà con người hiếm khi làm.
function label(exp: number) {
  if (exp < 8) return { t: 'Rất yếu', c: 'bad' };
  if (exp < 12) return { t: 'Yếu', c: 'bad' };
  if (exp < 16) return { t: 'Tạm được', c: 'warn' };
  return { t: 'Khá mạnh (nếu thật sự ngẫu nhiên)', c: 'good' };
}

const SALTS = { an: 'x9Q2', binh: 'Lm7e' };

export default function HashDemo() {
  const [pw, setPw] = useState('matkhau123');
  const [salted, setSalted] = useState(false);
  const [h, setH] = useState({ an: '', binh: '' });

  useEffect(() => {
    let alive = true;
    Promise.all([sha256((salted ? SALTS.an : '') + pw), sha256((salted ? SALTS.binh : '') + pw)]).then(([a, b]) => {
      if (alive) setH({ an: a, binh: b });
    });
    return () => {
      alive = false;
    };
  }, [pw, salted]);

  const s = strength(pw);
  const lb = label(s.exp);
  const same = h.an && h.an === h.binh;

  return (
    <div className="sim hash">
      <p className="sim-title">Hash và salt</p>
      <label className="hash-input">
        Mật khẩu chung của An và Bình{' '}
        <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} spellCheck={false} />
      </label>
      <div className="tabs" role="group" style={{ marginTop: 10 }}>
        <button type="button" className="btn" aria-pressed={!salted} onClick={() => setSalted(false)}>
          Không dùng salt
        </button>
        <button type="button" className="btn" aria-pressed={salted} onClick={() => setSalted(true)}>
          Có salt riêng cho mỗi người
        </button>
      </div>
      <table className="hash-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            {salted && <th>Salt</th>}
            <th>SHA-256 lưu trong cơ sở dữ liệu</th>
          </tr>
        </thead>
        <tbody>
          {(['an', 'binh'] as const).map((u) => (
            <tr key={u}>
              <td>{u === 'an' ? 'An' : 'Bình'}</td>
              {salted && (
                <td>
                  <code>{SALTS[u]}</code>
                </td>
              )}
              <td>
                <code className="hash-val">{h[u]}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sim-note">
        {same
          ? 'Hai hash giống hệt nhau. Ai đọc được cơ sở dữ liệu sẽ biết ngay An và Bình dùng chung mật khẩu, và chỉ cần đoán đúng một lần là có cả hai.'
          : 'Cùng mật khẩu nhưng hash khác nhau, vì mỗi người có salt riêng. Kẻ tấn công phải đoán riêng cho từng người, và bảng hash tính sẵn trở nên vô dụng.'}{' '}
        Thử đổi một ký tự trong mật khẩu: hash thay đổi hoàn toàn.
      </div>
      <p className="small" style={{ marginTop: 12 }}>
        Độ mạnh ước lượng: <strong className={`${lb.c}-text`}>{lb.t}</strong>
        <span className="muted">
          {' '}
          · {pw.length} ký tự, bảng chữ {s.pool} ký tự, khoảng 10<sup>{Math.round(s.exp)}</sup> tổ hợp
        </span>
      </p>
      <p className="muted small">
        Ước lượng này giả định mật khẩu ngẫu nhiên. Mật khẩu kiểu "matkhau123" thực tế yếu hơn nhiều vì nằm sẵn trong các danh sách mật khẩu phổ biến.
      </p>
    </div>
  );
}
