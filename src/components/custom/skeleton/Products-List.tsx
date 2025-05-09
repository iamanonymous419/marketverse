'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="grid gap-8 max-w-6xl mx-auto px-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-[400px,1fr] gap-8">
            {/* Image Skeleton */}
            <div className="aspect-square overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col justify-between p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />

              {/* Buttons Skeleton */}
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
