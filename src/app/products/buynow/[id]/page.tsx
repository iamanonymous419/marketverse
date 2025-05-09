'use client';

import ProductGridSkeleton from '@/components/custom/skeleton/Products-List';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import Order from './order';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setid] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const no = (await params).id;
      const num = parseInt(no);
      if (isNaN(num)) {
        console.log('Invalid Page');
      }
      setid(num);
      setLoading(false);
    };

    fetch();
  }, [params]);

  if (!isLoaded || loading) {
    return <ProductGridSkeleton />;
  }

  return (
    <main className="bg-auto min-h-screen py-8">
      <Order id={id} email={user?.primaryEmailAddress?.emailAddress || ''} />
    </main>
  );
};

export default Page;
