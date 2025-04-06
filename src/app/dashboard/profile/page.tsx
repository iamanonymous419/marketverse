'use client';

import { useUser } from '@clerk/nextjs';
import Profile from './Profile';
import { ProfileSkeleton } from '@/components/custom/skeleton/Profile-Skeleton';

const Page: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (isLoaded) {
    return <Profile email={user?.primaryEmailAddress?.emailAddress || ''} />;
  }

  return (
    <div>
      <ProfileSkeleton />
    </div>
  );
};

export default Page;
