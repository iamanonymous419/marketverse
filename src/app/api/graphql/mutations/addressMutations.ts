import { type DocumentNode, gql } from '@apollo/client';

export const ADD_ADDRESS_MUTATION: DocumentNode = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      message
    }
  }
`;

export const DELETE_ADDRESS_MUTATION: DocumentNode = gql`
  mutation DeleteAddress($id: Int!) {
    deleteAddress(id: $id) {
      message
    }
  }
`;

export const UPDATE_USER_ADDRESS: DocumentNode = gql`
  mutation UpdateUserAddress($input: AddressInput!) {
    updateAddress(input: $input) {
      message
    }
  }
`;

export const UPDATE_DEFAULT_USER_ADDRESS: DocumentNode = gql`
  mutation UpdateDefaultAddress(
    $email: String!
    $addressId: Int!
    $isDefault: Boolean!
  ) {
    updateDefaultAddress(
      email: $email
      addressID: $addressId
      isDefault: $isDefault
    ) {
      message
    }
  }
`;
