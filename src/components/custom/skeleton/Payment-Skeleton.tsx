import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-8 py-16">
        {/* Title */}
        <Skeleton className="h-8 w-[300px]" />

        {/* Payment Account Card */}
        <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-[140px] rounded-md" />
          </div>
        </div>
      </div>
    </main>
  );
}
