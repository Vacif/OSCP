import { useState, type ReactNode } from 'react';

// Email giả, công ty giả. Bấm vào những chỗ đáng ngờ.
const SPOTS: Record<string, string> = {
  from: 'Tên miền người gửi là "minhan-c0ng-ty.com", số 0 thay cho chữ o. Tên miền thật của công ty là minhan.vn.',
  greet: 'Lời chào chung chung "Kính gửi nhân viên". Phòng IT nội bộ thường biết tên bạn.',
  urgent: 'Tạo áp lực thời gian: "trong vòng 2 giờ" và doạ khoá tài khoản. Mục đích là để bạn hành động trước khi kịp nghĩ.',
  link: 'Chữ hiển thị là cổng nội bộ, nhưng đường dẫn thật (hiện khi rê chuột) trỏ tới một tên miền lạ. Luôn kiểm tra đường dẫn thật trước khi bấm.',
  ask: 'Yêu cầu nhập mật khẩu qua đường link trong email. Bộ phận IT đúng nghĩa không bao giờ xin mật khẩu của bạn.',
  attach: 'File đính kèm "HoaDon.pdf.exe" có đuôi kép. Thực chất đây là chương trình chạy được, không phải PDF.',
  typo: 'Lỗi chính tả và câu chữ lủng củng ("xác minh lai"). Không phải email lừa đảo nào cũng có lỗi, nhưng nếu có thì là dấu hiệu đáng chú ý.',
};

export default function PhishingSpotter() {
  const [found, setFound] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const total = Object.keys(SPOTS).length;

  const S = ({ id, children }: { id: string; children: ReactNode }) => (
    <button
      type="button"
      className={`spot ${found.includes(id) ? 'found' : ''}`}
      onClick={() => {
        setLast(id);
        setFound((f) => (f.includes(id) ? f : [...f, id]));
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="sim phish">
      <p className="sim-title">
        Tìm dấu hiệu lừa đảo · đã thấy {found.length}/{total}
      </p>
      <div className="mail">
        <div className="mail-head">
          <div>
            <span className="muted">Từ:</span> Phòng IT &lt;<S id="from">hotro@minhan-c0ng-ty.com</S>&gt;
          </div>
          <div>
            <span className="muted">Tiêu đề:</span> [KHẨN] Tài khoản email của bạn sắp bị khoá
          </div>
          <div>
            <span className="muted">Đính kèm:</span> <S id="attach">HoaDon.pdf.exe</S>
          </div>
        </div>
        <div className="mail-body">
          <p>
            <S id="greet">Kính gửi nhân viên,</S>
          </p>
          <p>
            Hệ thống phát hiện tài khoản của bạn có hoạt động bất thường. Để tránh bị khoá, bạn cần{' '}
            <S id="typo">xác minh lai thông tin</S> <S id="urgent">trong vòng 2 giờ tới, nếu không tài khoản sẽ bị xoá vĩnh viễn</S>.
          </p>
          <p>
            Vui lòng truy cập{' '}
            <S id="link">
              <span title="http://minhan-verify.top/login">congnoibo.minhan.vn</span>
            </S>{' '}
            và <S id="ask">nhập tên đăng nhập cùng mật khẩu hiện tại</S>.
          </p>
          <p>Trân trọng,<br />Bộ phận IT</p>
        </div>
      </div>
      <div className="sim-note" aria-live="polite">
        {last ? SPOTS[last] : 'Đọc email như thể bạn là nhân viên công ty Minh An, rồi bấm vào những chỗ bạn thấy đáng ngờ.'}
      </div>
      <div className="sim-controls">
        <button type="button" className="btn" onClick={() => setFound(Object.keys(SPOTS))}>
          Hiện tất cả
        </button>
        <button type="button" className="btn" onClick={() => { setFound([]); setLast(null); }}>
          Làm lại
        </button>
      </div>
    </div>
  );
}
