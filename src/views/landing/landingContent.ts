/**
 * Nội dung landing Mentoree · UniShare — định vị cho sinh viên Việt Nam.
 * Dịch vụ cốt lõi: kèm đồ án (BTL, đồ án môn học, đồ án tốt nghiệp / ĐATN),
 * nghiên cứu khoa học (NCKH), khóa luận, tiểu luận, ôn thi cuối kỳ,
 * luyện phỏng vấn thực tập, review CV, tư vấn ngành/định hướng.
 */
export const landingHero = {
  eyebrow: 'Mentoree · Mentor đồng hành cùng sinh viên Việt Nam',
  titleLine1: 'Vượt qua đồ án, BTL và NCKH',
  titleHighlight: 'cùng mentor',
  titleLine2: 'đi trước.',
  subtitle:
    'Kết nối với anh chị sinh viên giỏi và chuyên gia thực chiến để được kèm 1-1: đồ án môn học, bài tập lớn, đồ án tốt nghiệp, nghiên cứu khoa học, luyện phỏng vấn thực tập và định hướng nghề nghiệp.',
  primaryCta: { label: 'Tìm mentor cho đồ án', href: '/mentors' },
  secondaryCta: { label: 'Đăng ký miễn phí', href: '/register' },
};

export const landingStats = [
  { value: '500+', label: 'Mentor là anh chị đi trước' },
  { value: '30+', label: 'Trường đại học tại Việt Nam' },
  { value: '20+', label: 'Ngành & chuyên ngành' },
  { value: '95%', label: 'Sinh viên hài lòng sau buổi đầu' },
];

export const landingAboutBlocks = [
  {
    number: '01',
    title: 'Kèm 1-1 cho đồ án & BTL',
    description:
      'Mentor review đề tài, hướng dẫn code/báo cáo, góp ý trước khi nộp và luyện bảo vệ — từ bài tập lớn, đồ án môn học đến đồ án tốt nghiệp (ĐATN).',
    variant: 'light' as const,
  },
  {
    number: '02',
    title: 'Hỗ trợ NCKH & khóa luận',
    description:
      'Giúp bạn chọn hướng nghiên cứu, đọc paper, viết đề cương, xử lý số liệu và trình bày theo chuẩn báo cáo/seminar NCKH sinh viên.',
    variant: 'dark' as const,
  },
  {
    number: '03',
    title: 'Định hướng ngành & thực tập',
    description:
      'Review CV, luyện phỏng vấn thực tập/fresher, tư vấn lộ trình kỹ năng và chọn chuyên ngành dựa trên kinh nghiệm thật của mentor.',
    variant: 'accent' as const,
  },
];

export const landingWhyChoose = [
  {
    title: 'Hiểu chương trình học của sinh viên Việt Nam',
    description:
      'Mentor từ các trường kỹ thuật, kinh tế, ngoại ngữ… nắm rõ format đồ án, tiêu chí chấm NCKH và văn hoá bảo vệ hội đồng tại Việt Nam.',
    emphasis: true,
  },
  {
    title: 'Gói học linh hoạt theo deadline',
    description:
      'Đặt lẻ 1 buổi gỡ khó, gói kèm theo tuần tới lúc bảo vệ, hoặc đồng hành dài hạn theo kỳ — chọn đúng nhu cầu, không trả dư.',
    emphasis: false,
  },
  {
    title: 'Giá sinh viên, thanh toán an toàn',
    description:
      'Mức giá phù hợp túi tiền sinh viên, thanh toán qua cổng an toàn, có lịch sử giao dịch và chính sách hoàn tiền rõ ràng.',
    emphasis: false,
  },
];

export const landingFeatures = [
  {
    title: 'Tìm mentor theo môn học & đề tài',
    points: [
      'Lọc theo ngành (CNTT, Kinh tế, Điện-Điện tử, Cơ khí, Ngôn ngữ…).',
      'Chọn mentor từ trường/khối ngành phù hợp với bạn.',
      'Xem hồ sơ: môn đã hỗ trợ, đề tài đã kèm, đánh giá của sinh viên trước.',
    ],
  },
  {
    title: 'Đặt lịch quanh deadline',
    points: [
      'Chọn khung giờ rảnh của bạn — học tối, cuối tuần đều được.',
      'Nhắc lịch trước buổi qua email/thông báo.',
      'Đổi/hủy lịch theo chính sách minh bạch khi kế hoạch thay đổi.',
    ],
  },
  {
    title: 'Gói kèm đồ án & NCKH',
    points: [
      'Gói lẻ 1 buổi: gỡ bug, chữa báo cáo, ôn trước bảo vệ.',
      'Gói theo dự án: đồng hành từ đề cương tới lúc nộp.',
      'Gói dài hạn: mentor định hướng theo từng kỳ.',
    ],
  },
  {
    title: 'Cộng đồng sinh viên học hỏi',
    points: [
      'Tài liệu, template báo cáo/slide bảo vệ do mentor biên soạn.',
      'Chia sẻ kinh nghiệm thực tập, câu hỏi phỏng vấn thường gặp.',
      'Kết nối nhiều mentor cho nhiều môn/đồ án khác nhau.',
    ],
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

export const faqs = [
  {
    question: 'Mentoree hỗ trợ những loại đồ án nào cho sinh viên?',
    answer:
      'Mentor có thể đồng hành với bài tập lớn (BTL), đồ án môn học, đồ án chuyên ngành, đồ án tốt nghiệp (ĐATN), khóa luận, tiểu luận và đề tài nghiên cứu khoa học (NCKH) sinh viên ở nhiều ngành như CNTT, Kinh tế, Điện - Điện tử, Cơ khí, Xây dựng, Ngoại ngữ, Thiết kế…',
  },
  {
    question: 'Mentor trên Mentoree là ai?',
    answer:
      'Đa số là anh chị sinh viên giỏi, cựu sinh viên đã đi làm và giảng viên trẻ/NCS tại các trường đại học Việt Nam. Hồ sơ mentor được xác thực trước khi xuất hiện công khai.',
  },
  {
    question: 'Chi phí một buổi kèm là bao nhiêu?',
    answer:
      'Mức giá do mentor tự đặt, hiển thị công khai trên hồ sơ. Có gói buổi lẻ để gỡ khó nhanh và gói theo dự án (kèm tới lúc nộp/bảo vệ) — bạn chủ động chọn theo ngân sách sinh viên.',
  },
  {
    question: 'Các buổi học diễn ra như thế nào?',
    answer:
      'Mặc định học online qua video call, màn hình chia sẻ để mentor hướng dẫn trực tiếp trên code/báo cáo. Một số mentor nhận gặp offline nếu cùng khu vực.',
  },
  {
    question: 'Tôi có thể đổi lịch hoặc hoàn tiền không?',
    answer:
      'Bạn có thể đổi/hủy lịch theo chính sách hiển thị trên gói của mentor (thường trước 24 giờ). Nếu buổi học không diễn ra đúng cam kết, bạn có thể yêu cầu hoàn tiền qua kênh hỗ trợ của nền tảng.',
  },
  {
    question: 'Mentoree có làm hộ đồ án hay viết thuê không?',
    answer:
      'Không. Mentor chỉ hướng dẫn, review, góp ý và luyện bảo vệ — giúp bạn tự hoàn thiện sản phẩm của mình. Điều này đảm bảo bạn học được kỹ năng và tránh rủi ro vi phạm quy chế học thuật.',
  },
];

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
