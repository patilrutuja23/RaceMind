export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-shimmer rounded-lg ${className}`} />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i % 2 === 0 ? "w-full" : "w-4/5"}`} />
      ))}
    </div>
  );
}
