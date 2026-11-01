import { useState } from 'react';

// Tính điểm CVSS v3.1 phần Base theo công thức của FIRST.
type Opt = { k: string; vi: string; v: number; vc?: number };
type Metric = { id: string; name: string; help: string; opts: Opt[] };

const METRICS: Metric[] = [
  { id: 'AV', name: 'Đường tấn công', help: 'Kẻ tấn công cần đứng ở đâu để khai thác?', opts: [
    { k: 'N', vi: 'Qua Internet', v: 0.85 }, { k: 'A', vi: 'Cùng mạng nội bộ', v: 0.62 }, { k: 'L', vi: 'Trên máy (đã đăng nhập)', v: 0.55 }, { k: 'P', vi: 'Chạm vào thiết bị', v: 0.2 } ] },
  { id: 'AC', name: 'Độ phức tạp', help: 'Có cần điều kiện đặc biệt nằm ngoài tầm kiểm soát của kẻ tấn công không?', opts: [
    { k: 'L', vi: 'Thấp', v: 0.77 }, { k: 'H', vi: 'Cao', v: 0.44 } ] },
  { id: 'PR', name: 'Quyền cần có', help: 'Kẻ tấn công cần tài khoản ở mức nào trước?', opts: [
    { k: 'N', vi: 'Không cần', v: 0.85, vc: 0.85 }, { k: 'L', vi: 'Người dùng thường', v: 0.62, vc: 0.68 }, { k: 'H', vi: 'Quản trị', v: 0.27, vc: 0.5 } ] },
  { id: 'UI', name: 'Cần nạn nhân thao tác', help: 'Có cần ai đó bấm link, mở file... không?', opts: [
    { k: 'N', vi: 'Không', v: 0.85 }, { k: 'R', vi: 'Có', v: 0.62 } ] },
  { id: 'S', name: 'Phạm vi', help: 'Ảnh hưởng có lan ra ngoài thành phần bị lỗi không? Ví dụ thoát khỏi máy ảo ra máy chủ.', opts: [
    { k: 'U', vi: 'Không đổi', v: 0 }, { k: 'C', vi: 'Lan rộng', v: 1 } ] },
  { id: 'C', name: 'Bảo mật (C)', help: 'Kẻ tấn công đọc được bao nhiêu dữ liệu?', opts: [
    { k: 'H', vi: 'Cao', v: 0.56 }, { k: 'L', vi: 'Thấp', v: 0.22 }, { k: 'N', vi: 'Không', v: 0 } ] },
  { id: 'I', name: 'Toàn vẹn (I)', help: 'Kẻ tấn công sửa được bao nhiêu dữ liệu?', opts: [
    { k: 'H', vi: 'Cao', v: 0.56 }, { k: 'L', vi: 'Thấp', v: 0.22 }, { k: 'N', vi: 'Không', v: 0 } ] },
  { id: 'A', name: 'Sẵn sàng (A)', help: 'Hệ thống có bị ngừng hoạt động không?', opts: [
    { k: 'H', vi: 'Cao', v: 0.56 }, { k: 'L', vi: 'Thấp', v: 0.22 }, { k: 'N', vi: 'Không', v: 0 } ] },
];

function roundUp(x: number) {
  const i = Math.round(x * 100000);
  return i % 10000 === 0 ? i / 100000 : (Math.floor(i / 10000) + 1) / 10;
}

export function cvss31(sel: Record<string, string>) {
  const g = (id: string) => METRICS.find((m) => m.id === id)!.opts.find((o) => o.k === sel[id])!;
  const changed = sel.S === 'C';
  const pr = g('PR');
  const iss = 1 - (1 - g('C').v) * (1 - g('I').v) * (1 - g('A').v);
  const impact = changed ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
  const expl = 8.22 * g('AV').v * g('AC').v * (changed ? pr.vc! : pr.v) * g('UI').v;
  if (impact <= 0) return 0;
  return changed ? roundUp(Math.min(1.08 * (impact + expl), 10)) : roundUp(Math.min(impact + expl, 10));
}

function severity(s: number) {
  if (s === 0) return { t: 'Không có', c: 'muted' };
  if (s < 4) return { t: 'Thấp', c: 'good' };
  if (s < 7) return { t: 'Trung bình', c: 'warn' };
  if (s < 9) return { t: 'Cao', c: 'bad' };
  return { t: 'Nghiêm trọng', c: 'bad' };
}

export default function CvssCalc() {
  const [sel, setSel] = useState<Record<string, string>>({ AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'H', I: 'H', A: 'H' });
  const score = cvss31(sel);
  const sev = severity(score);
  const vector = 'CVSS:3.1/' + METRICS.map((m) => `${m.id}:${sel[m.id]}`).join('/');

  return (
    <div className="sim cvss">
      <p className="sim-title">Tính điểm CVSS 3.1 (phần Base)</p>
      <div className="cvss-grid">
        {METRICS.map((m) => (
          <fieldset key={m.id} className="cvss-m">
            <legend title={m.help}>
              {m.name} <span className="muted small">{m.id}</span>
            </legend>
            <p className="muted small">{m.help}</p>
            <div className="cvss-opts">
              {m.opts.map((o) => (
                <button key={o.k} type="button" className="btn" aria-pressed={sel[m.id] === o.k} onClick={() => setSel((s) => ({ ...s, [m.id]: o.k }))}>
                  {o.vi}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="cvss-result">
        <span className={`cvss-score ${sev.c}-bg`}>{score.toFixed(1)}</span>
        <div>
          <strong>Mức độ: {sev.t}</strong>
          <code className="cvss-vector">{vector}</code>
        </div>
      </div>
    </div>
  );
}
