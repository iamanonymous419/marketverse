'use client';
import { useUser } from '@clerk/nextjs';
import { ProductList } from './product-list';
import ProfileSkelCreateProductSkeleton from '@/components/custom/skeleton/List-Skeleton';

const Page: React.FunctionComponent = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProfileSkelCreateProductSkeleton />;
  }

  return (
    <main className="bg-auto min-h-screen py-8">
      <ProductList email={user?.primaryEmailAddress?.emailAddress || ''} />
    </main>
  );
};

export default Page;
