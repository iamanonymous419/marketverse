// graphql/schema/index.js
import { gql } from 'graphql-tag';
import { addressTypeDefs } from './address';

// Base schema with empty Query type that we'll extend
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, addressTypeDefs];
