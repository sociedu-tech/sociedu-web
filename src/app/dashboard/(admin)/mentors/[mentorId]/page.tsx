import React, { use } from 'react';

export default function AdminMentorOverviewPage({ params }: { params: Promise<{ mentorId: string }> }) {
  const { mentorId } = use(params);
  return (
    <div>
      {/* TODO: Thống kê doanh thu, đánh giá, tỷ lệ phản hồi của Mentor {mentorId} */}
    </div>
  );
}
