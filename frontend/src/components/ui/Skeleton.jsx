export const Skeleton = ({ className = "" }) => (
  <div className={`shimmer-bg rounded-lg ${className}`} />
);

export const DoctorCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-4 animate-fade-in">
    <div className="h-1 bg-slate-100 -mx-5 -mt-5 mb-4 rounded-t-2xl" />
    <div className="flex gap-4">
      <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-px w-full" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-20" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
    <div className="flex items-center justify-between pt-1">
      <div className="space-y-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-28" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
  </div>
);
