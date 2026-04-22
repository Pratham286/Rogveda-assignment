export const Skeleton = ({ className = "" }) => (
  <div className={`shimmer-bg rounded-lg ${className}`} />
);

export const HospitalCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-card space-y-4 animate-fade-in">
    <div className="flex gap-4">
      <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1 rounded-xl" />
      <Skeleton className="h-8 flex-1 rounded-xl" />
    </div>
    <div className="flex items-center justify-between pt-1">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
  </div>
);
