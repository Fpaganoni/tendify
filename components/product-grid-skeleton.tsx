import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <Skeleton className="h-9 w-48 mx-auto" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            {/* Image */}
            <Skeleton className="aspect-square w-full" />
            {/* Content */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            {/* Button */}
            <div className="px-4 pb-4">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
