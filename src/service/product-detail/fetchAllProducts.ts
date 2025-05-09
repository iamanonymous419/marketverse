import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchProducts } from './fetchData';
import { type Product, type ApiResponse } from '@/types';

export const useFetchProducts = (): UseQueryResult<
  ApiResponse<Product[]>,
  Error
> => {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ['products-buyer'],
    queryFn: fetchProducts, // No need to wrap in an async function
    staleTime: 5 * 60 * 1000,
  });
};
