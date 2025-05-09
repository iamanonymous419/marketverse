import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchDataByEmail } from './fetchData';
import { type SellerInfo, type ApiResponse } from '@/types';

export const useFetchDataByEmail = (
  email: string | undefined
): UseQueryResult<ApiResponse<SellerInfo>, Error> => {
  return useQuery<ApiResponse<SellerInfo>>({
    queryKey: ['details-seller', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required');
      return await fetchDataByEmail(email); // Ensure this is an async function
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};
