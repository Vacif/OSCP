import { useState } from 'react';

const LAYERS = [
  { n: 7, name: 'Application', vi: 'Ứng dụng', tcpip: 'Ứng dụng', pdu: 'Dữ liệu', ex: 'HTTP, DNS, SMTP, SSH', job: 'Nơi chương trình của bạn nói chuyện với mạng. Trình duyệt gửi yêu cầu HTTP ở tầng này.', real: 'Nội dung lá thư.' },
  { n: 6, name: 'Presentation', vi: 'Trình bày', tcpip: 'Ứng dụng', pdu: 'Dữ liệu', ex: 'TLS (mã hoá), UTF-8, JPEG', job: 'Chuyển đổi định dạng, nén và mã hoá dữ liệu để hai bên hiểu được nhau.', real: 'Dịch lá thư sang ngôn ngữ chung, hoặc cho vào phong bì niêm phong.' },
  { n: 5, name: 'Session', vi: 'Phiên', tcpip: 'Ứng dụng', pdu: 'Dữ liệu', ex: 'Phiên đăng nhập, RPC', job: 'Mở, giữ và đóng một cuộc hội thoại giữa hai ứng dụng.', real: 'Cuộc trao đổi thư qua lại về cùng một chuyện.' },
  { n: 4, name: 'Transport', vi: 'Giao vận', tcpip: 'Giao vận', pdu: 'Segment', ex: 'TCP, UDP (cổng 80, 443, 53...)', job: 'Chia dữ liệu thành đoạn, đánh số, đảm bảo tới đủ (TCP) hoặc gửi nhanh không kiểm tra (UDP). Số cổng cho biết dữ liệu dành cho ứng dụng nào.', real: 'Số phòng trong toà nhà, và có gửi bảo đảm hay không.' },
  { n: 3, name: 'Network', vi: 'Mạng', tcpip: 'Internet', pdu: 'Packet', ex: 'IP, ICMP', job: 'Đánh địa chỉ IP và chọn đường đi qua nhiều mạng khác nhau. Router làm việc ở tầng này.', real: 'Địa chỉ nhà ghi trên phong bì.' },
  { n: 2, name: 'Data Link', vi: 'Liên kết dữ liệu', tcpip: 'Truy cập mạng', pdu: 'Frame', ex: 'Ethernet, Wi-Fi, địa chỉ MAC, ARP', job: 'Chuyển dữ liệu giữa hai thiết bị trong cùng một mạng cục bộ, dùng địa chỉ MAC. Switch làm việc ở tầng này.', real: 'Người đưa thư trong khu phố, chỉ biết nhà nào ở đâu trong khu.' },
  { n: 1, name: 'Physical', vi: 'Vật lý', tcpip: 'Truy cập mạng', pdu: 'Bit', ex: 'Cáp đồng, cáp quang, sóng radio', job: 'Biến bit 0 và 1 thành tín hiệu điện, ánh sáng hoặc sóng.', real: 'Con đường và chiếc xe chở thư.' },
];

const WRAP = [
  { name: 'Dữ liệu', parts: [{ t: 'GET /index.html', k: 'data' }] },
  { name: 'Tầng 4 thêm header TCP', parts: [{ t: 'TCP · cổng 80', k: 'l4' }, { t: 'GET /index.html', k: 'data' }] },
  { name: 'Tầng 3 thêm header IP', parts: [{ t: 'IP · 10.0.0.5 → 10.0.0.9', k: 'l3' }, { t: 'TCP · cổng 80', k: 'l4' }, { t: 'GET /index.html', k: 'data' }] },
  { name: 'Tầng 2 thêm header Ethernet', parts: [{ t: 'Ethernet · MAC', k: 'l2' }, { t: 'IP', k: 'l3' }, { t: 'TCP', k: 'l4' }, { t: 'GET /index.html', k: 'data' }, { t: 'FCS', k: 'l2' }] },
  { name: 'Tầng 1 gửi thành bit', parts: [{ t: '0110100001110100011101000111000000101111...', k: 'l1' }] },
];

export default function OsiLayers() {
  const [sel, setSel] = useState(3);
  const [mode, setMode] = useState<'layers' | 'wrap'>('layers');
  const [w, setW] = useState(0);
  const L = LAYERS[sel];

  return (
    <div className="sim osi">
      <p className="sim-title">Mô hình OSI 7 tầng</p>
      <div className="tabs" role="group">
        <button type="button" className="btn" aria-pressed={mode === 'layers'} onClick={() => setMode('layers')}>
          Xem từng tầng
        </button>
        <button type="button" className="btn" aria-pressed={mode === 'wrap'} onClick={() => setMode('wrap')}>
          Xem quá trình đóng gói
        </button>
      </div>

      {mode === 'layers' ? (
        <div className="osi-grid">
          <ol className="osi-stack">
            {LAYERS.map((l, i) => (
              <li key={l.n}>
                <button type="button" className={`osi-layer l${l.n} ${i === sel ? 'on' : ''}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
                  <span className="osi-n">{l.n}</span>
                  <span>
                    {l.vi} <span className="muted">({l.name})</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="osi-detail">
            <h4>
              Tầng {L.n}: {L.vi}
            </h4>
            <p>{L.job}</p>
            <dl>
              <dt>Ví dụ</dt>
              <dd>{L.ex}</dd>
              <dt>Đơn vị dữ liệu</dt>
              <dd>{L.pdu}</dd>
              <dt>Trong mô hình TCP/IP</dt>
              <dd>Tầng {L.tcpip}</dd>
              <dt>So với gửi thư</dt>
              <dd>{L.real}</dd>
            </dl>
          </div>
        </div>
      ) : (
        <div>
          <p className="osi-wrap-name">
            Bước {w + 1}/{WRAP.length}: {WRAP[w].name}
          </p>
          <div className="osi-packet">
            {WRAP[w].parts.map((p, i) => (
              <span key={i} className={`osi-part ${p.k}`}>
                {p.t}
              </span>
            ))}
          </div>
          <p className="muted small">
            Mỗi tầng bọc thêm phần đầu (header) của mình bên ngoài dữ liệu của tầng trên. Bên nhận làm ngược lại: bóc từng lớp từ tầng 1 lên tầng 7.
          </p>
          <div className="sim-controls">
            <button type="button" className="btn" onClick={() => setW((v) => v - 1)} disabled={w === 0}>
              ← Lùi
            </button>
            <button type="button" className="btn primary" onClick={() => setW((v) => v + 1)} disabled={w === WRAP.length - 1}>
              Tiếp →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
