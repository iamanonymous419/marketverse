import axios from 'axios';
import { type SellerInfo, type ApiResponse } from '@/types';

export const fetchDataByEmail = async (
  email: string | undefined
): Promise<ApiResponse<SellerInfo>> => {
  try {
    const { data } = await axios.post<ApiResponse<SellerInfo>>('/api/details', {
      email,
    });
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

    return { message: errorMessage, data: null }; // Ensure consistency
  }
};
