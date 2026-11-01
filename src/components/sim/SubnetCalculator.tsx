import { useState } from 'react';

function parseIp(s: string): number | null {
  const parts = s.trim().split('.');
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    v = v * 256 + n;
  }
  return v;
}

const toIp = (v: number) => [24, 16, 8, 0].map((s) => Math.floor(v / 2 ** s) % 256).join('.');
const toBin = (v: number) => v.toString(2).padStart(32, '0');

export default function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.130');
  const [prefix, setPrefix] = useState(24);
  const v = parseIp(ip);

  let body = <p className="bad-text">Địa chỉ IP chưa hợp lệ. Cần 4 số từ 0 đến 255, cách nhau bằng dấu chấm.</p>;
  if (v !== null) {
    const size = 2 ** (32 - prefix);
    const network = Math.floor(v / size) * size;
    const broadcast = network + size - 1;
    const mask = 2 ** 32 - size;
    const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : size - 2;
    const bin = toBin(v);
    body = (
      <>
        <div className="subnet-bits" aria-label="Địa chỉ dạng nhị phân">
          {bin.split('').map((b, i) => (
            <span key={i} className={`${i < prefix ? 'net' : 'host'} ${i % 8 === 7 && i < 31 ? 'oct' : ''}`}>
              {b}
            </span>
          ))}
        </div>
        <p className="small">
          <span className="legend net">■</span> {prefix} bit phần mạng &nbsp; <span className="legend host">■</span> {32 - prefix} bit phần máy
        </p>
        <table>
          <tbody>
            <tr><th>Subnet mask</th><td><code>{toIp(mask)}</code></td></tr>
            <tr><th>Địa chỉ mạng</th><td><code>{toIp(network)}/{prefix}</code></td></tr>
            <tr><th>Địa chỉ broadcast</th><td><code>{toIp(broadcast)}</code></td></tr>
            <tr>
              <th>Dải dùng được cho máy</th>
              <td>{prefix >= 31 ? <span className="muted">Mạng quá nhỏ, trường hợp đặc biệt</span> : <code>{toIp(network + 1)} → {toIp(broadcast - 1)}</code>}</td>
            </tr>
            <tr><th>Số máy tối đa</th><td>{hosts.toLocaleString('vi-VN')}</td></tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <div className="sim subnet">
      <p className="sim-title">Máy tính subnet</p>
      <div className="sim-controls" style={{ marginTop: 0 }}>
        <label>
          IP{' '}
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} size={16} spellCheck={false} />
        </label>
        <label>
          / <input type="number" min={8} max={32} value={prefix} onChange={(e) => setPrefix(Math.min(32, Math.max(8, Number(e.target.value) || 8)))} style={{ width: 70 }} />
        </label>
      </div>
      <input type="range" min={8} max={32} value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} aria-label="Độ dài prefix" className="subnet-range" />
      {body}
      <p className="muted small">Thử kéo thanh trượt: prefix càng lớn thì phần mạng càng dài, số máy trong mạng càng ít.</p>
    </div>
  );
}
