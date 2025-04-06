'use client';

import { Skeleton } from '@/components/ui/skeleton';

const SkeletonLoader = () => {
  return (
    <div className="max-w-7xl mx-auto mt-16 mb-16 p-8 flex flex-col lg:flex-row gap-10">
      {/* Left Side - Product Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Skeleton className="h-[400px] w-full max-w-lg rounded-2xl" />
      </div>

      {/* Right Side - Product Details */}
      <div className="flex flex-col w-full space-y-8">
        {/* Title */}
        <Skeleton className="h-10 w-3/4 max-w-xl" />
        <Skeleton className="h-10 w-1/2 max-w-lg" />

        {/* Price */}
        <Skeleton className="h-12 w-1/3 max-w-md" />

        {/* Delivery & Stock Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex gap-8">
          <Skeleton className="h-14 w-1/2 sm:w-1/3 rounded-lg" />
          <Skeleton className="h-14 w-1/2 sm:w-1/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
