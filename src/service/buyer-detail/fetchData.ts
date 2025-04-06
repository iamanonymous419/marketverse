import { type ApiResponse, type BuyerProfile } from '@/types';
import axios from 'axios';

export const fetchDataByEmailForBuyer = async (
  email: string | undefined
): Promise<ApiResponse<BuyerProfile>> => {
  try {
    const { data } = await axios.post<ApiResponse<BuyerProfile>>(
      '/api/user/get-user',
      { email }
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

    return { message: errorMessage, data: null }; // Ensure consistency
  }
};
