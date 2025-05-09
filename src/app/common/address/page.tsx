'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import Address from './Address';
import AddressListSkeleton from '@/components/custom/skeleton/Address-Skeleton';

const Page: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <AddressListSkeleton />;
  }

  return <Address email={user?.emailAddresses[0].emailAddress || ''} />;
};

export default Page;
