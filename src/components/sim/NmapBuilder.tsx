import { useState } from 'react';

interface Flag {
  flag: string;
  label: string;
  explain: string;
  group: 'khám phá' | 'cổng' | 'dịch vụ' | 'tốc độ' | 'xuất';
}

const FLAGS: Flag[] = [
  { flag: '-sC', label: 'Script mặc định', explain: 'Chạy bộ script an toàn để lấy thêm thông tin (tiêu đề web, chứng chỉ, bản ghi SMB...).', group: 'dịch vụ' },
  { flag: '-sV', label: 'Nhận diện phiên bản', explain: 'Hỏi chuyện từng dịch vụ để đoán tên và phiên bản phần mềm. Đây là thứ dẫn tới bước tìm CVE.', group: 'dịch vụ' },
  { flag: '-p-', label: 'Tất cả 65535 cổng', explain: 'Quét toàn bộ cổng TCP thay vì chỉ 1000 cổng phổ biến. Chậm hơn nhưng không bỏ sót cổng lạ.', group: 'cổng' },
  { flag: '-p 80,445', label: 'Cổng chỉ định', explain: 'Chỉ quét các cổng bạn nêu. Dùng khi đã biết cần nhìn vào đâu.', group: 'cổng' },
  { flag: '-sU', label: 'Quét UDP', explain: 'Quét cổng UDP (DNS, SNMP...). Chậm, nhưng nhiều dịch vụ quan trọng chỉ lộ trên UDP.', group: 'cổng' },
  { flag: '-Pn', label: 'Bỏ qua ping', explain: 'Coi như máy đang bật, không ping trước. Cần khi máy chặn ping (hay gặp với Windows có firewall).', group: 'khám phá' },
  { flag: '-sn', label: 'Chỉ quét host', explain: 'Chỉ tìm máy nào đang sống trong dải, không quét cổng. Dùng để vẽ bản đồ mạng ban đầu.', group: 'khám phá' },
  { flag: '-T4', label: 'Nhanh hơn', explain: 'Tăng tốc độ gửi gói. Nhanh hơn nhưng ồn hơn và dễ sai với mạng chập chờn.', group: 'tốc độ' },
  { flag: '-oN scan.txt', label: 'Lưu kết quả', explain: 'Ghi kết quả ra file để đưa vào ghi chú và báo cáo. Luôn nên lưu lại.', group: 'xuất' },
];

export default function NmapBuilder() {
  const [sel, setSel] = useState<Record<string, boolean>>({ '-sC': true, '-sV': true, '-p-': true });
  const [target, setTarget] = useState('10.10.10.5');
  const chosen = FLAGS.filter((f) => sel[f.flag]);
  const cmd = `nmap ${chosen.map((f) => f.flag).join(' ')} ${target}`.replace(/\s+/g, ' ');

  const sample = sel['-sU']
    ? null
    : [
        'PORT     STATE SERVICE    VERSION',
        '22/tcp   open  ssh        OpenSSH 7.6p1 Ubuntu',
        '80/tcp   open  http       Apache httpd 2.4.29',
        '445/tcp  open  microsoft-ds Samba smbd 4.7.6',
      ];

  return (
    <div className="sim nmapb">
      <p className="sim-title">Dựng lệnh nmap</p>
      <label className="nmapb-target">
        Mục tiêu (IP hoặc dải){' '}
        <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} spellCheck={false} size={16} />
      </label>
      <div className="nmapb-flags">
        {FLAGS.map((f) => (
          <label key={f.flag} className={`nmapb-flag ${sel[f.flag] ? 'on' : ''}`}>
            <input type="checkbox" checked={!!sel[f.flag]} onChange={() => setSel((s) => ({ ...s, [f.flag]: !s[f.flag] }))} />
            <code>{f.flag}</code>
            <span>{f.label}</span>
          </label>
        ))}
      </div>
      <p className="nmapb-cmdlabel">Lệnh dựng ra:</p>
      <pre className="nmapb-cmd"><code>{cmd}</code></pre>
      {chosen.length > 0 && (
        <ul className="nmapb-explain">
          {chosen.map((f) => (
            <li key={f.flag}>
              <code>{f.flag}</code> — {f.explain}
            </li>
          ))}
        </ul>
      )}
      {sample && (
        <>
          <p className="nmapb-cmdlabel">Kết quả mẫu (rút gọn):</p>
          <pre className="nmapb-sample">{sample.join('\n')}</pre>
          <p className="muted small">Từ đây: cổng 445 chạy Samba 4.7.6 và cổng 80 chạy Apache 2.4.29 là hai mục tiêu rõ ràng để liệt kê tiếp và tra CVE.</p>
        </>
      )}
    </div>
  );
}
