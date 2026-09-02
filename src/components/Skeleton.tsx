// Base building block for content-shaped loading placeholders — used instead of a
// generic spinner/text wherever the final layout (cards, rows, tables) is known ahead
// of time, so the loading state doesn't visually jump once real data arrives.
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />;
}

export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5">
      <div className="flex items-center gap-4">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <Skeleton className="w-10 h-5" />
    </div>
  );
}

export function UserRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-white/5 bg-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-2 min-w-0">
          <Skeleton className="w-36 h-3.5" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-16 h-8 rounded-lg" />
    </div>
  );
}

export function SectionCardSkeleton() {
  return (
    <div className="w-full py-6 px-4 sm:py-7 sm:px-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
      <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

export function ReportCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-3">
      <Skeleton className="w-2/3 h-4" />
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-1/3 h-3" />
    </div>
  );
}
