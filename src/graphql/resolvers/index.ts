// graphql/resolvers/index.js
import { mergeResolvers } from '@graphql-tools/merge';
import { addressResolvers } from './address';

export const resolvers = mergeResolvers([addressResolvers]);
