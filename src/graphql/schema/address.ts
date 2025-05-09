// graphql/schema/addressSchema.js
import { gql } from 'graphql-tag';

export const addressTypeDefs = gql`
  type BuyerAddress {
    id: ID!
    email: String!
    addressID: Int!
    isDefault: Boolean!
    country: String!
    fullName: String!
    streetName: String
    city: String!
    state: String!
    pincode: String!
    phoneNo: String!
    createdAt: String!
    updatedAt: String!
  }

  input AddressInput {
    email: String!
    isDefault: Boolean
    country: String!
    fullName: String!
    streetName: String
    city: String!
    state: String!
    pincode: String!
    phoneNo: String!
    addressID: Int
  }

  type AddressResponse {
    address: BuyerAddress
    message: String!
    success: Boolean!
  }

  type ResponseMessage {
    success: Boolean!
    message: String!
  }

  extend type Query {
    addressesByEmail(email: String!): [BuyerAddress]
  }

  extend type Mutation {
    addAddress(input: AddressInput!): AddressResponse!
    updateAddress(input: AddressInput!): AddressResponse!
    deleteAddress(id: Int!): AddressResponse!
    updateDefaultAddress(
      email: String!
      addressID: Int!
      isDefault: Boolean!
    ): ResponseMessage!
  }
`;
