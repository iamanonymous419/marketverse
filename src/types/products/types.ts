import { Product } from '../schema/interface';

// for page product list or explore products page
export interface ProductListProps {
  products: Product[];
}

// list a product props
export interface ImageCarouselProps {
  productImages: string[];
  className?: string;
}

// address page props
export interface AddressProps {
  email: string;
}

export interface AddressQl extends AddressProps {
  refetch: () => void; // Accept refetch function as a prop
}

// props for buyer profile
export interface MainProps {
  email: string | undefined;
  buyerId: string | undefined;
}

// props for seller profile
export interface SellerType {
  email: string;
  sellerId: string;
}

// address type for address page due to order
export type AddressType = {
  fullName: string;
  streetName: string | null;
  city: string;
  state: string;
  pincode: string;
  phoneNo: string;
} | null;

// payment interface props for payment page like review page
interface PaymentAccount {
  accountUsername: string;
  accountNumber: string;
}

// this is for order page and api
export interface Order {
  orderID: number;
  orderStatus:
    | 'pending'
    | 'approved'
    | 'cancelled'
    | 'delivered'
    | 'decline'
    | 'approve';
  orderDate: string; // Added order date
  sellerEmail: string;
  buyerEmail: string;
  address: AddressType;
  products: Product | null;
  paymentAccount: PaymentAccount;
}

// product form interface for list a product a page
export interface ProductFormData {
  productName: string;
  productPrice: number;
  productDescription: string;
  productImages: FileList;
  sellerEmail?: string;
}

// account data type for payment page
export interface AccountData {
  accountUsername: string | null | undefined;
  accountNumber: string;
  sellerId: string;
  sellerEmail: string;
}

// these review props for reivew page of product
export interface ReviewProps {
  productId: number;
  email: string;
}
