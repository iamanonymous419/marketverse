// response type
export interface AddToCartRequest {
  email: string;
  productId: number;
}

// common api types
export interface ApiResponseCommon {
  message: string;
}

// api response if server is sending the data
export interface ApiResponse<T> extends ApiResponseCommon {
  data?: T | null;
}

// interface for cloudinary response
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}
