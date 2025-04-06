import type React from 'react';
import { AddAddressDialog } from './Dialog';
import type { Address, AddressProps, AddressQueryResponse } from '@/types';
import AddressCard from './Card';
import { useQuery } from '@apollo/client';
import { GET_ADDRESSES_BY_EMAIL } from '@/app/api/graphql/queries/addressQueries';

const Address: React.FC<AddressProps> = ({ email }) => {
  const { data, refetch } = useQuery<AddressQueryResponse>(
    GET_ADDRESSES_BY_EMAIL,
    {
      variables: { email },
      fetchPolicy: 'cache-and-network', // Ensures the latest data is fetched
    }
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AddAddressDialog email={email} refetch={refetch} />

        {/* Address Cards */}
        {data?.addressesByEmail?.map((address: Address) => (
          <AddressCard
            key={address.addressID}
            address={address}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default Address;
