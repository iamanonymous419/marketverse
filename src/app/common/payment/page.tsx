'use client';

import { useUser } from '@clerk/nextjs';

import Main from './payment';
import Loading from '@/components/custom/skeleton/Payment-Skeleton';

const Page: React.FunctionComponent = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  // This is page and api for this page use, my basic banking api. to simulate this, but i wanna use stripe or razor pay , but they were asking many question and i am not able to later may be add but for now this is what is this
  return (
    <div className="container mx-auto py-10">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center ">
          Payment Account Information
        </h1>
        <Main
          email={user?.primaryEmailAddress?.emailAddress}
          buyerId={user?.id}
        />
      </main>
    </div>
  );
};

export default Page;
