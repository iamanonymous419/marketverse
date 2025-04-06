'use client';

import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import Order from './Order';

const Page: React.FunctionComponent = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProductGridSkeleton />;
  }
  return (
    <main className="bg-auto min-h-screen py-8">
      <Order email={user?.primaryEmailAddress?.emailAddress || ''} />
    </main>
  );
};

export default Page;
