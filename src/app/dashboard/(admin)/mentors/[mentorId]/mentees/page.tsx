export default async function AdminMentorMenteesPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ mentorId: string }> 
}) {
  const params = await paramsPromise;
  return (
    <div>
      {/* TODO: Hiển thị danh sách học viên đang học với Mentor {params.mentorId} */}
    </div>
  );
}
