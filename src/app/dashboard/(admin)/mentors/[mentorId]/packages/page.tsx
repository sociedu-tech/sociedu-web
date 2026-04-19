export default async function AdminMentorPackagesPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ mentorId: string }> 
}) {
  const params = await paramsPromise;
  return (
    <div>
      {/* TODO: Hiển thị các gói dịch vụ của Mentor {params.mentorId} + Nút duyệt/khóa */}
    </div>
  );
}
