import { useState } from 'react';

const WHO = [
  { k: 'u', vi: 'Chủ sở hữu (user)' },
  { k: 'g', vi: 'Nhóm (group)' },
  { k: 'o', vi: 'Người khác (other)' },
];
const BITS = [
  { c: 'r', v: 4, file: 'đọc nội dung', dir: 'xem danh sách file bên trong' },
  { c: 'w', v: 2, file: 'sửa nội dung', dir: 'tạo, xoá, đổi tên file bên trong' },
  { c: 'x', v: 1, file: 'chạy như chương trình', dir: 'đi vào thư mục (cd)' },
];

export default function PermissionViz() {
  const [bits, setBits] = useState<boolean[]>([true, true, true, true, false, true, false, false, false]);
  const [isDir, setIsDir] = useState(false);

  const digits = [0, 1, 2].map((w) => BITS.reduce((s, b, i) => s + (bits[w * 3 + i] ? b.v : 0), 0));
  const symbolic = (isDir ? 'd' : '-') + bits.map((on, i) => (on ? BITS[i % 3].c : '-')).join('');
  const octal = digits.join('');

  function setOctal(s: string) {
    if (!/^[0-7]{3}$/.test(s)) return;
    setBits(s.split('').flatMap((d) => BITS.map((b) => (Number(d) & b.v) !== 0)));
  }

  return (
    <div className="sim perm">
      <p className="sim-title">Quyền file trên Linux</p>
      <div className="tabs" role="group">
        <button type="button" className="btn" aria-pressed={!isDir} onClick={() => setIsDir(false)}>
          File
        </button>
        <button type="button" className="btn" aria-pressed={isDir} onClick={() => setIsDir(true)}>
          Thư mục
        </button>
      </div>
      <div className="perm-grid">
        {WHO.map((w, wi) => (
          <div key={w.k} className="perm-col">
            <p className="perm-who">{w.vi}</p>
            {BITS.map((b, bi) => {
              const idx = wi * 3 + bi;
              return (
                <label key={b.c} className={`perm-bit ${bits[idx] ? 'on' : ''}`}>
                  <input type="checkbox" checked={bits[idx]} onChange={() => setBits((p) => p.map((v, j) => (j === idx ? !v : v)))} />
                  <code>{b.c}</code>
                  <span>{isDir ? b.dir : b.file}</span>
                </label>
              );
            })}
            <p className="perm-digit">= {digits[wi]}</p>
          </div>
        ))}
      </div>
      <div className="perm-out">
        <div>
          <span className="muted small">ls -l hiển thị</span>
          <code className="big">{symbolic}</code>
        </div>
        <div>
          <span className="muted small">Dạng số (gõ để thử)</span>
          <input type="text" key={octal} defaultValue={octal} maxLength={3} onChange={(e) => setOctal(e.target.value)} style={{ width: 80 }} />
        </div>
        <div>
          <span className="muted small">Lệnh tương ứng</span>
          <code>chmod {octal} {isDir ? 'thu-muc' : 'file.txt'}</code>
        </div>
      </div>
      <p className="muted small">r = 4, w = 2, x = 1. Cộng lại cho từng nhóm người dùng. Ví dụ rwx = 4+2+1 = 7, r-x = 4+1 = 5.</p>
    </div>
  );
}
