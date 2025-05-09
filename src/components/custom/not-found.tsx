'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NoProductsPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh text-center px-6">
      <AlertCircle className="h-16 w-16 text-gray-500 dark:text-gray-400" />
      <h1 className="text-2xl font-semibold mt-4">No Products Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        We couldn&apos;t find any products. Try browsing other categories.
      </p>

      <Button
        variant="default"
        className="mt-6"
        onClick={() => router.push('/')}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NoProductsPage;
