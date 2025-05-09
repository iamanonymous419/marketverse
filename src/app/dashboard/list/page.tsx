'use client';
import ProductForm from './Product';
import { useUser } from '@clerk/nextjs';
import ProfileSkelCreateProductSkeleton from '@/components/custom/skeleton/List-Skeleton';

const Page: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProfileSkelCreateProductSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <ProductForm
        email={user?.primaryEmailAddress?.emailAddress || ''}
        sellerId={user?.id || ''}
      />
    </div>
  );
};

export default Page;
