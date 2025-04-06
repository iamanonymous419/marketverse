'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

const ProductCardSkeleton = () => {
  return (
    <Card className="relative">
      <div className="relative h-56 overflow-hidden rounded-t-lg">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="p-4">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-3">
          <Skeleton className="h-7 w-24" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

const ProductRowSkeleton = ({
  numberOfCards = 3,
}: {
  numberOfCards?: number;
}) => {
  return (
    <div className="relative">
      <Skeleton className="h-8 w-72 mb-6" />
      <div className="flex gap-6 pb-6 px-2">
        {Array.from({ length: numberOfCards }).map((_, index) => (
          <div key={index} className="min-w-[400px] flex-shrink-0">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductGridSkeleton = () => {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-12 w-72 mb-12 mx-auto" />
      <div className="space-y-16">
        <ProductRowSkeleton />
        <ProductRowSkeleton />
        <ProductRowSkeleton />
      </div>
    </div>
  );
};

export default ProductGridSkeleton;
