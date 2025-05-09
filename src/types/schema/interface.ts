// for database table schema

// types of table to use in api
export interface Product {
  id: number;
  productId: number;
  sellerId: string;
  sellerEmail: string;
  productName: string;
  productPrice: number;
  productDescription: string;
  productImages: string[];
}

export interface Address {
  id?: number; // Optional since it's a serial/auto-increment
  email: string;
  addressID: number;
  isDefault: boolean;
  country: string;
  fullName: string;
  streetName?: string | null; // Optional as it's not marked as notNull
  city: string;
  state: string;
  pincode: string;
  phoneNo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id?: number; // Optional if auto-incremented
  accountUsername: string | null; // Allow null values
  accountNumber: string;
  buyerId: string;
  buyerEmail: string;
}

export interface Newsletter {
  id: number;
  email: string;
  createdAt: Date;
  time: string;
}

export type SellerInfo = {
  email: string;
  id: number;
  uniqueId: string;
  firstName: string;
  lastName: string | null;
  username: string;
  age: number;
  phoneNo: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say' | null | string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
export interface Seller {
  id: number;
  email: string;
  uniqueId: string;
  username: string;
  firstName: string;
  lastName: string;
  isSeller: boolean;
}

// Define the order status types
export type OrderStatus =
  | 'decline'
  | 'pending'
  | 'approve'
  | 'cancelled'
  | 'delivered';

// Interface for Orders table
export interface OrderType {
  id?: number; // Optional since it's a serial/auto-increment
  orderId: number; // Unique integer order ID
  buyerEmail: string;
  sellerEmail: string;
  orderAt: Date;
  status: OrderStatus;
  productId: number;
  addressID: number;
  accountNumber: number;
  accountUsername?: string;
  transactionN0?: string;
}

// Interface for Reviews table
export interface Review {
  id: number; // Optional since it's a serial/auto-increment primary key
  productId: number; // Foreign key referencing products table
  reviewMessage: string;
  reviewDate: string | null; // Optional with default current date
  reviewStar: number; // Rating out of 5
  profileImageUrl: string | null; // Optional profile image URL
  firstName: string;
  lastName: string | null; // Optional last name
}

// Interface for creating/updating buyer profile
export interface BuyerProfile {
  email: string;
  id: number;
  uniqueId: string;
  firstName: string;
  lastName: string | null;
  username: string;
  age: number;
  phoneNo: string;
  gender: string | null;
  profileImageUrl: string | null;
  cartItems: number[] | unknown;
  wishlistItems: number[] | unknown;
  createdAt: string;
  updatedAt: string;
}
