// graphql/queries/addressQueries.ts
import { type DocumentNode, gql } from '@apollo/client';

export const GET_ADDRESSES_BY_EMAIL: DocumentNode = gql`
  query GetAddressesByEmail($email: String!) {
    addressesByEmail(email: $email) {
      fullName
      city
      state
      isDefault
      streetName
      country
      pincode
      phoneNo
      addressID
      email
    }
  }
`;
