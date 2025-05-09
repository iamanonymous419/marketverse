import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Seller Profile Information</h1>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-6 w-[200px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
