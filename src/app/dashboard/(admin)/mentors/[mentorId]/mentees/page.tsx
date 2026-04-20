import React, { use } from 'react';

export default function AdminMentorMenteesPage({ params }: { params: Promise<{ mentorId: string }> }) {
  const { mentorId } = use(params);
  return (
    <div>
      {/* TODO: Hiển thị danh sách học viên đang học với Mentor {mentorId} */}
    </div>
  );
}
