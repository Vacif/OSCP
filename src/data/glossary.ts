export interface Term {
  term: string;
  en?: string;
  def: string;
  lesson?: string;
}

// Giữ theo thứ tự abc tiếng Việt khi hiển thị; nguồn dữ liệu để lẫn cũng được.
export const glossary: Term[] = [
  { term: 'Active Directory', en: 'AD', def: 'Hệ thống của Microsoft để quản lý tập trung người dùng, máy tính và quyền trong mạng doanh nghiệp Windows.', lesson: '3.4' },
  { term: 'ASLR', def: 'Lớp bảo vệ bộ nhớ xáo trộn ngẫu nhiên vị trí các vùng nhớ mỗi lần chạy, khiến kẻ tấn công khó đoán địa chỉ.', lesson: '3.6' },
  { term: 'Bắt tay ba bước', en: 'three-way handshake', def: 'Quá trình SYN → SYN+ACK → ACK để thiết lập một kết nối TCP.', lesson: '1.2' },
  { term: 'Băm', en: 'hash', def: 'Hàm một chiều biến dữ liệu thành một chuỗi cố định; từ chuỗi đó không có đường tắt suy ngược về dữ liệu gốc. Dùng để lưu mật khẩu.', lesson: '2.6' },
  { term: 'Broadcast', def: 'Địa chỉ đặc biệt trong một mạng; gửi tới đó là gửi cho mọi máy trong mạng. Bit phần host toàn 1.', lesson: '1.1' },
  { term: 'CIA', def: 'Bộ ba mục tiêu bảo mật: Confidentiality (bảo mật), Integrity (toàn vẹn), Availability (sẵn sàng).', lesson: '0.1' },
  { term: 'CVE', def: 'Mã định danh cho một lỗ hổng đã công bố công khai, dạng CVE-năm-số.', lesson: '2.5' },
  { term: 'CVSS', def: 'Hệ thống chấm điểm mức độ nghiêm trọng của lỗ hổng, từ 0 đến 10.', lesson: '2.5' },
  { term: 'DNS', def: 'Hệ thống phân giải tên miền thành địa chỉ IP, như cuốn danh bạ của Internet.', lesson: '1.3' },
  { term: 'Domain Controller', en: 'DC', def: 'Máy chủ giữ cơ sở dữ liệu Active Directory và xử lý đăng nhập; mục tiêu giá trị nhất trong một domain.', lesson: '3.4' },
  { term: 'Enumeration', en: 'liệt kê', def: 'Giai đoạn tìm hiểu chi tiết: máy nào bật, cổng nào mở, dịch vụ gì, phiên bản nào. Bước quan trọng nhất của pentest.', lesson: '2.2' },
  { term: 'Firewall', def: 'Thiết bị hoặc phần mềm kiểm soát lưu lượng mạng ra vào, có thể chặn hoặc cho qua theo quy tắc.', lesson: '1.2' },
  { term: 'Forest', def: 'Tập hợp một hoặc nhiều domain trong Active Directory; là ranh giới an ninh ngoài cùng.', lesson: '3.4' },
  { term: 'HTTP', def: 'Giao thức truyền dữ liệu web, gồm yêu cầu (phương thức, đường dẫn, header) và phản hồi (mã trạng thái, nội dung).', lesson: '1.3' },
  { term: 'HTTPS', def: 'HTTP chạy trong một lớp mã hoá TLS; bảo vệ dữ liệu trên đường truyền và xác thực máy chủ.', lesson: '1.3' },
  { term: 'Hypervisor', def: 'Phần mềm tạo và chạy máy ảo, ví dụ VirtualBox hay VMware.', lesson: '0.2' },
  { term: 'Kerberos', def: 'Giao thức xác thực của Active Directory dùng các "vé" (ticket) thay cho việc gửi mật khẩu khắp nơi.', lesson: '3.4' },
  { term: 'Kali Linux', def: 'Bản Linux cài sẵn nhiều công cụ kiểm thử, do OffSec phát triển; thường dùng làm máy tấn công.', lesson: '0.2' },
  { term: 'Leo thang đặc quyền', en: 'privilege escalation', def: 'Đi từ quyền thấp lên quyền cao hơn trên một máy đã vào được.', lesson: '3.1' },
  { term: 'OWASP Top 10', def: 'Danh sách 10 nhóm rủi ro bảo mật web phổ biến nhất, cập nhật định kỳ.', lesson: '2.3' },
  { term: 'Phishing', en: 'lừa đảo qua email', def: 'Hình thức kỹ thuật xã hội dùng email giả mạo để dụ nạn nhân tiết lộ thông tin hoặc mở nội dung độc hại.', lesson: '2.4' },
  { term: 'Pivoting', def: 'Dùng một máy đã chiếm được làm bàn đạp để với tới các máy không chạm trực tiếp được.', lesson: '3.3' },
  { term: 'Port', en: 'cổng', def: 'Số cho biết dữ liệu dành cho dịch vụ nào trên một máy; IP đưa tới đúng máy, cổng đưa tới đúng dịch vụ.', lesson: '1.2' },
  { term: 'Prefix', def: 'Số bit phần mạng trong một địa chỉ, viết sau dấu gạch chéo, ví dụ /24. Prefix lớn thì mạng nhỏ.', lesson: '1.1' },
  { term: 'Registry', def: 'Cơ sở dữ liệu cấu hình trung tâm của Windows, lưu thiết lập hệ thống và phần mềm.', lesson: '1.5' },
  { term: 'Rules of Engagement', en: 'quy tắc tham gia', def: 'Văn bản ghi rõ phạm vi, thời gian và giới hạn của một đợt pentest.', lesson: '0.1' },
  { term: 'Salt', def: 'Chuỗi ngẫu nhiên khác nhau cho mỗi người, thêm vào trước khi băm mật khẩu, để vô hiệu hoá bảng hash tính sẵn.', lesson: '2.6' },
  { term: 'Snapshot', def: 'Ảnh chụp trạng thái máy ảo tại một thời điểm, để quay lại nhanh khi cần.', lesson: '0.2' },
  { term: 'SQL injection', def: 'Lỗ hổng khi dữ liệu người dùng bị trộn vào câu truy vấn cơ sở dữ liệu và xử lý như một phần câu lệnh.', lesson: '2.3' },
  { term: 'Stack', def: 'Vùng nhớ dạng chồng, lưu biến cục bộ và địa chỉ trả về của mỗi hàm đang chạy.', lesson: '3.6' },
  { term: 'Subnet', def: 'Một phân đoạn mạng; chia mạng lớn thành nhiều mạng nhỏ giúp quản lý và tăng an toàn.', lesson: '1.1' },
  { term: 'SUID', def: 'Bit quyền trên Linux khiến một chương trình luôn chạy với quyền của chủ sở hữu; đặt sai có thể dẫn tới leo thang đặc quyền.', lesson: '3.1' },
  { term: 'SYSTEM', def: 'Tài khoản quyền cao nhất mà hệ điều hành Windows dùng; đích đến thường gặp của leo thang đặc quyền trên Windows.', lesson: '1.5' },
  { term: 'TCP', def: 'Giao thức truyền dữ liệu có xác nhận, đảm bảo tới đủ và đúng thứ tự; hợp với web, email, tải file.', lesson: '1.2' },
  { term: 'Token', def: 'Trên Windows, mô tả gắn với mỗi tiến trình, ghi rõ nó chạy với danh nghĩa tài khoản nào và có đặc quyền gì.', lesson: '3.2' },
  { term: 'Tràn bộ đệm', en: 'buffer overflow', def: 'Lỗi khi dữ liệu được ghi quá vùng nhớ dành sẵn, tràn sang vùng lân cận, có thể ghi đè địa chỉ trả về.', lesson: '3.6' },
  { term: 'UDP', def: 'Giao thức truyền dữ liệu nhanh, không xác nhận; hợp với gọi video, DNS, game.', lesson: '1.2' },
  { term: 'Xác thực hai lớp', en: '2FA', def: 'Yêu cầu thêm một yếu tố ngoài mật khẩu khi đăng nhập, nên mật khẩu lộ vẫn chưa đủ để vào.', lesson: '2.6' },
  { term: 'XSS', def: 'Lỗ hổng khi mã của kẻ tấn công được nhét vào trang web và chạy trong trình duyệt của người dùng khác.', lesson: '2.3' },
];
