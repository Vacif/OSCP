import { useState } from 'react';

// Minh hoạ vì sao nối chuỗi để tạo câu truy vấn là lỗi, và truy vấn tham số hoá sửa nó ra sao.
// Không có cơ sở dữ liệu nào ở đây, chỉ phân tích chuỗi.

const BEFORE = "SELECT * FROM khach_hang WHERE ten = '";
const AFTER = "';";

type Seg = { text: string; fromUser: boolean; inString: boolean };

function analyse(input: string): { segs: Seg[]; broken: boolean } {
  const full = BEFORE + input + AFTER;
  const userStart = BEFORE.length;
  const userEnd = userStart + input.length;
  const segs: Seg[] = [];
  let inStr = false;
  let broken = false;
  for (let i = 0; i < full.length; i++) {
    const ch = full[i];
    const fromUser = i >= userStart && i < userEnd;
    const wasIn = inStr;
    if (ch === "'") inStr = !inStr;
    // Ký tự người dùng nhập mà nằm ngoài chuỗi ký tự, hoặc chính là dấu nháy đóng chuỗi, nghĩa là cấu trúc câu lệnh đã bị đổi.
    const inside = ch === "'" ? false : wasIn;
    if (fromUser && (!inside || ch === "'")) broken = true;
    const last = segs[segs.length - 1];
    if (last && last.fromUser === fromUser && last.inString === inside) last.text += ch;
    else segs.push({ text: ch, fromUser, inString: inside });
  }
  return { segs, broken };
}

const PRESETS = ['Lan', 'Nguyễn Văn Hùng', "O'Neil"];

export default function QueryDemo() {
  const [val, setVal] = useState('Lan');
  const [mode, setMode] = useState<'concat' | 'param'>('concat');
  const { segs, broken } = analyse(val);

  return (
    <div className="sim query">
      <p className="sim-title">Dữ liệu người dùng đi vào câu truy vấn</p>
      <label>
        Ô tìm kiếm khách hàng theo tên:{' '}
        <input type="text" value={val} onChange={(e) => setVal(e.target.value)} spellCheck={false} />
      </label>
      <div className="sim-controls" style={{ marginTop: 8 }}>
        <span className="small muted">Thử nhanh:</span>
        {PRESETS.map((p) => (
          <button key={p} type="button" className="btn" onClick={() => setVal(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="tabs" role="group" style={{ marginTop: 14 }}>
        <button type="button" className="btn" aria-pressed={mode === 'concat'} onClick={() => setMode('concat')}>
          Cách sai: nối chuỗi
        </button>
        <button type="button" className="btn" aria-pressed={mode === 'param'} onClick={() => setMode('param')}>
          Cách đúng: truy vấn tham số hoá
        </button>
      </div>

      {mode === 'concat' ? (
        <>
          <pre className="query-code">
            <code>{'query = "' + BEFORE + '" + ten + "' + AFTER + '"'}</code>
          </pre>
          <p className="small muted">Câu lệnh thực sự gửi tới cơ sở dữ liệu:</p>
          <pre className="query-sql">
            {segs.map((s, i) => (
              <span key={i} className={s.fromUser ? (s.inString ? 'u-data' : 'u-code') : ''}>
                {s.text}
              </span>
            ))}
          </pre>
          <div className={`sim-note ${broken ? 'bad-bg' : ''}`} aria-live="polite">
            {broken
              ? 'Dấu nháy trong dữ liệu đã đóng chuỗi sớm. Phần tô đỏ không còn được hiểu là tên khách hàng nữa mà bị đọc như một phần của câu lệnh SQL. Với tên thật như O\'Neil, chương trình sẽ báo lỗi. Với dữ liệu do kẻ xấu cố ý soạn, câu lệnh có thể làm việc khác hẳn ý lập trình viên.'
              : 'Phần tô xanh là dữ liệu người dùng, vẫn nằm gọn trong dấu nháy nên được hiểu là tên. Nhưng an toàn ở đây chỉ là do may mắn: nó phụ thuộc hoàn toàn vào việc người dùng nhập gì.'}
          </div>
        </>
      ) : (
        <>
          <pre className="query-code">
            <code>{`query = "SELECT * FROM khach_hang WHERE ten = ?"\ncursor.execute(query, (ten,))`}</code>
          </pre>
          <p className="small muted">Cơ sở dữ liệu nhận hai thứ tách biệt:</p>
          <pre className="query-sql">
            {'Câu lệnh:  SELECT * FROM khach_hang WHERE ten = ?\nTham số 1: '}
            <span className="u-data">{JSON.stringify(val)}</span>
          </pre>
          <div className="sim-note good-bg" aria-live="polite">
            Câu lệnh và dữ liệu đi riêng. Dù người dùng gõ gì, kể cả dấu nháy, cơ sở dữ liệu luôn coi đó là một giá trị để so sánh, không bao giờ là lệnh.
          </div>
        </>
      )}
    </div>
  );
}
