export function SlotSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-11 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
        />
      ))}
    </div>
  );
}
