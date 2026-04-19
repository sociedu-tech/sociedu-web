/**
 * Nội dung landing Mentoree — ngắn gọn, tổng quát (không gắn một loại hình cụ thể).
 */

export const landingHero = {
  eyebrow: 'Mentoree · Đồng hành cùng sinh viên',
  titleLine1: 'Học và phát triển',
  titleHighlight: 'cùng mentor',
  titleLine2: 'phù hợp với bạn.',
  subtitle:
    'Kết nối với anh chị đi trước và chuyên gia để được hỗ trợ 1-1 theo mục tiêu của bạn — từ môn học, dự án, nghiên cứu đến định hướng nghề nghiệp.',
  primaryCta: { label: 'Tìm mentor', href: '/mentors' },
  secondaryCta: { label: 'Đăng ký miễn phí', href: '/register' },
};

export const landingStats = [
  { value: '500+', label: 'Mentor đồng hành' },
  { value: '30+', label: 'Trường đại học' },
  { value: '20+', label: 'Lĩnh vực' },
  { value: '95%', label: 'Hài lòng sau buổi đầu' },
];

/** Tiêu đề khu vực About trên LandingPage */
export const landingAboutSection = {
  heading: 'Mentoree là gì?',
  tagline: 'Một nơi để bạn nhận hỗ trợ học thuật và phát triển bản thân — linh hoạt theo nhu cầu.',
};

export const landingAboutBlocks = [
  {
    number: '01',
    title: 'Học thuật & dự án',
    description:
      'Gỡ khó bài tập, dự án môn học hoặc đề tài dài hơn: mentor cùng bạn làm rõ hướng đi, review và góp ý — bạn vẫn là người làm chủ sản phẩm.',
    variant: 'light' as const,
  },
  {
    number: '02',
    title: 'Nghiên cứu & viết luận',
    description:
      'Định hướng đọc tài liệu, cấu trúc báo cáo và trình bày — phù hợp khi bạn cần khung rõ ràng hơn là làm hộ.',
    variant: 'dark' as const,
  },
  {
    number: '03',
    title: 'Hướng nghiệp & thực tế',
    description:
      'Tư vấn lộ trình, kỹ năng mềm, CV và phỏng vấn — dựa trên kinh nghiệm thật của mentor, không công thức chung cho mọi người.',
    variant: 'accent' as const,
  },
];

/** Cột trái mục “Vì sao chọn Mentoree?” */
export const landingWhyIntro = {
  lead:
    'Mentor hiểu bối cảnh học tập tại Việt Nam và đồng hành theo tiến độ của bạn — không một khuôn mẫu cho tất cả.',
};

export const landingWhyChoose = [
  {
    title: 'Sát thực tế sinh viên',
    description:
      'Người đi trước trong nhiều ngành — nắm cách học, cách làm bài và áp lực deadline mà bạn đang gặp.',
    emphasis: true,
  },
  {
    title: 'Linh hoạt thời gian & gói',
    description:
      'Buổi lẻ khi cần gỡ nhanh, hoặc đồng hành dài hơn theo mục tiêu — bạn chọn mức phù hợp.',
    emphasis: false,
  },
  {
    title: 'Minh bạch & an toàn',
    description:
      'Thông tin mentor, giá và lịch rõ ràng; thanh toán qua nền tảng, có lịch sử và chính sách hủy/đổi theo quy định.',
    emphasis: false,
  },
];

/** Khối tính năng (nền tối) — tiêu đề cột trái */
export const landingFeaturesIntro = {
  title: 'Bạn làm được gì trên Mentoree?',
  body: 'Tìm đúng người, đặt lịch, học 1-1 và theo dõi tiến độ — gọn trong một luồng.',
};

export const landingFeatures = [
  {
    title: 'Tìm mentor phù hợp',
    points: ['Lọc theo ngành, kỹ năng và mục tiêu.', 'Xem hồ sơ, kinh nghiệm và đánh giá trước khi chọn.'],
  },
  {
    title: 'Đặt lịch theo bạn',
    points: ['Chọn khung giờ phù hợp; nhắc lịch qua thông báo.', 'Đổi/hủy theo chính sách hiển thị rõ.'],
  },
  {
    title: 'Gói học linh hoạt',
    points: ['Buổi đơn hoặc gói theo mục tiêu.', 'Mức giá do mentor công bố — bạn so sánh và quyết định.'],
  },
  {
    title: 'Cộng đồng & tài liệu',
    points: ['Chia sẻ kinh nghiệm và mẫu tham khảo hữu ích.', 'Kết nối nhiều mentor cho nhiều nhu cầu khác nhau.'],
  },
];

export const categories = [
  'Tất cả',
  'CNTT',
  'Kinh tế',
  'Điện - Điện tử',
  'Cơ khí',
  'Xây dựng',
  'Ngoại ngữ',
  'Thiết kế',
  'Dữ liệu',
  'NCKH',
];

export const testimonials = [
  {
    text: 'Mình được mentor review cả code lẫn báo cáo đồ án tốt nghiệp, luyện luôn phần bảo vệ trước hội đồng nên buổi hôm đó khá tự tin, điểm cao hơn kỳ vọng.',
    author: 'Thu Hà',
    title: 'SV năm 4 · Công nghệ thông tin',
    bgColor: 'bg-primary text-white',
    floatClassName: 'mt-0',
  },
  {
    text: 'Nhóm mình làm NCKH lần đầu, mentor hướng dẫn cách đọc paper, viết đề cương và xử lý số liệu bằng Python. Nhờ vậy bài nộp đúng hạn và được chọn báo cáo cấp khoa.',
    author: 'Gia Bảo',
    title: 'SV năm 3 · Kinh tế',
    bgColor: 'bg-teal-light text-dark',
    floatClassName: 'md:mt-12',
  },
  {
    text: 'Trước khi phỏng vấn intern, mình đặt 2 buổi luyện với mentor đang làm ở công ty tech. Được góp ý CV và tập trả lời câu hỏi thực tế, sau đó mình pass vòng cuối.',
    author: 'Minh Khôi',
    title: 'SV năm 3 · Kỹ thuật phần mềm',
    bgColor: 'bg-purple-light text-dark',
    floatClassName: 'mt-0',
  },
  {
    text: 'BTL môn cơ sở dữ liệu của mình bị bí đúng deadline, mentor gỡ giúp trong 1 buổi và giải thích lại phần ERD rất dễ hiểu. Tiếc là không biết Mentoree sớm hơn.',
    author: 'Phương Linh',
    title: 'SV năm 2 · Hệ thống thông tin',
    bgColor: 'bg-peach text-dark',
    floatClassName: 'md:mt-12',
  },
];

export const landingFaqSection = {
  subtitle: 'Vài câu hỏi thường gặp trước khi bạn bắt đầu.',
};

export const faqs = [
  {
    question: 'Mentoree phù hợp loại hỗ trợ nào?',
    answer:
      'Từ môn học, dự án, nghiên cứu, luận văn đến định hướng nghề — miễn là bạn cần người đi trước đồng hành 1-1. Phạm vi cụ thể phụ thuộc từng mentor và được mô tả trên hồ sơ.',
  },
  {
    question: 'Mentor là ai?',
    answer:
      'Anh chị sinh viên giỏi, cựu SV, người đi làm hoặc giảng viên trẻ tại các trường. Hồ sơ được kiểm duyệt trước khi hiển thị công khai.',
  },
  {
    question: 'Chi phí thế nào?',
    answer:
      'Mỗi mentor đặt giá và gói (buổi lẻ hoặc theo mục tiêu). Bạn xem trước trên hồ sơ và chọn phù hợp ngân sách.',
  },
  {
    question: 'Buổi học diễn ra ra sao?',
    answer:
      'Chủ yếu học online qua video call, chia sẻ màn hình khi cần. Một số mentor có thể gặp trực tiếp nếu cùng khu vực.',
  },
  {
    question: 'Đổi lịch hoặc hoàn tiền?',
    answer:
      'Theo chính sách hiển thị trên từng gói (thường có thời hạn hủy/đổi). Nếu buổi không đúng cam kết, liên hệ hỗ trợ để xử lý.',
  },
  {
    question: 'Mentoree có làm hộ bài hay viết thuê không?',
    answer:
      'Không. Mentor hướng dẫn, góp ý và luyện — bạn tự hoàn thành công việc của mình, phù hợp quy chế học thuật.',
  },
];

export const landingCta = {
  titlePrefix: 'Sẵn sàng ',
  titleHighlight: 'bắt đầu',
  titleSuffix: '?',
  body: 'Đăng ký miễn phí, tìm mentor phù hợp và đặt buổi đầu trong vài phút.',
  primaryLabel: 'Tìm mentor',
};

export const mentorCategories = [
  {
    name: 'CNTT & Lập trình',
    count: 'Đồ án web/app, ĐATN, thuật toán',
    img: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Kinh tế & Quản trị',
    count: 'BTL, khóa luận, phân tích tình huống',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Nghiên cứu khoa học',
    count: 'Đề cương, xử lý số liệu, báo cáo',
    img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  },
];
