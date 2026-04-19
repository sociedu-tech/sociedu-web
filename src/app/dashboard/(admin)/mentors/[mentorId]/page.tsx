export default async function AdminMentorOverviewPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ mentorId: string }> 
}) {
  const params = await paramsPromise;
  return (
    <div>
      {/* TODO: Thống kê doanh thu, đánh giá, tỷ lệ phản hồi của Mentor {params.mentorId} */}
    </div>
  );
}
