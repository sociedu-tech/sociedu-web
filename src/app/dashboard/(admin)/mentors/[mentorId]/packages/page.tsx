import React, { use } from 'react';

export default function AdminMentorPackagesPage({ params }: { params: Promise<{ mentorId: string }> }) {
  const { mentorId } = use(params);
  return (
    <div>
      {/* TODO: Hiển thị các gói dịch vụ của Mentor {mentorId} + Nút duyệt/khóa */}
    </div>
  );
}
