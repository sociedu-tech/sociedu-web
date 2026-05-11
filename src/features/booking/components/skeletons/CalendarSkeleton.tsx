export function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
        />
      ))}
    </div>
  );
}
