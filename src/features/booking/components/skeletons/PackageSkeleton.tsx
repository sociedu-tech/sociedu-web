export function PackageSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-gray-100" />
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
