import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchDataByEmailForBuyer } from './fetchData';
import { type BuyerProfile, type ApiResponse } from '@/types';

export const useFetchDataByEmailForBuyer = (
  email: string | undefined
): UseQueryResult<ApiResponse<BuyerProfile>, Error> => {
  return useQuery<ApiResponse<BuyerProfile>>({
    queryKey: ['details-buyer', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required');
      return await fetchDataByEmailForBuyer(email); // Ensure this is an async function
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
    // cacheTime: 30 * 60 * 1000,
    // select: (data) => data.data, // This will extract the data array from the response
  });
};
