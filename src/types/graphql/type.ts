import type { GraphQLResolveInfo } from 'graphql';
import { Address } from '../schema/interface';
import { db } from '@/db';

// Define the type for GraphQL response
export interface AddressQueryResponse {
  addressesByEmail: Address[];
}

interface MutationResponse {
  message: string;
}

// Extend MutationResponse for different mutations
export type AddAddressResponse = { addAddress: MutationResponse };
export type UpdateAddressResponse = { updateAddress: MutationResponse };
export type DeleteAddressResponse = { deleteAddress: MutationResponse };
export type DefaultUpdateAddressResponse = {
  updateDefaultAddress: MutationResponse;
};

interface GraphQLContext {
  db: typeof db;
}

// TypeScript interface for address input
export interface AddressInput {
  email: string;
  isDefault?: boolean;
  country: string;
  fullName: string;
  streetName?: string;
  city: string;
  state: string;
  pincode: string;
  phoneNo: string;
  addressID?: number;
}

export interface QueryResolvers {
  addressesByEmail: (
    _: undefined,
    args: { email: string },
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => Promise<Address[]>;
}

interface AddressResponse {
  success: boolean;
  message: string;
  address?: Address | null;
  error?: string;
}

export interface MutationResolvers {
  addAddress: (
    _: undefined,
    args: { input: AddressInput },
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => Promise<AddressResponse>;

  deleteAddress: (
    _: undefined,
    args: { id: number },
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => Promise<AddressResponse>;

  updateAddress: (
    _: undefined,
    args: { input: AddressInput },
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => Promise<AddressResponse>;

  updateDefaultAddress: (
    _: undefined,
    args: { email: string; addressID: number; isDefault: boolean },
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => Promise<AddressResponse>;
}
