'use client';

import { useUser } from '@clerk/nextjs';
import { ProductList } from './product-list';
import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';

import React from 'react';

const Page: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProductGridSkeleton />;
  }

  return (
    <main className="bg-auto min-h-screen py-8">
      <ProductList email={user?.primaryEmailAddress?.emailAddress || ''} />
    </main>
  );
};

export default Page;
