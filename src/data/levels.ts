export interface Level {
  id: number;
  name: string;
  blurb: string;
}

export const levels: Level[] = [
  { id: 0, name: 'Khởi động', blurb: 'Hiểu nghề pentest, luật chơi và dựng lab để thực hành an toàn.' },
  { id: 1, name: 'Nền tảng', blurb: 'Mạng, Linux, Windows và một chút lập trình. Phần này chắc thì phần sau mới dễ.' },
  { id: 2, name: 'Trung cấp', blurb: 'Thu thập thông tin, dò dịch vụ, lỗ hổng web, mật khẩu và cách đánh giá mức độ rủi ro.' },
  { id: 3, name: 'Nâng cao', blurb: 'Leo thang đặc quyền, mạng nội bộ, Active Directory và cách chương trình dùng bộ nhớ.' },
  { id: 4, name: 'Ôn thi và nghề nghiệp', blurb: 'Viết báo cáo, chiến lược làm bài thi và kế hoạch luyện tập.' },
];
