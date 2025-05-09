import { type ApiResponse, type Product } from '@/types';
import axios from 'axios';

export const fetchProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const { data } = await axios.get<ApiResponse<Product[]>>(
      '/api/products/fetch/'
    );
    return data;
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = error.response.data?.error || 'Server error';
      } else if (error.request) {
        errorMessage = 'No response from server';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { message: errorMessage, data: [] }; // Ensure consistency
  }
};
