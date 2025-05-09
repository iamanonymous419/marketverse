// lib/apollo-client.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  type NormalizedCacheObject,
} from '@apollo/client';

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: '/api/graphql',
    }),
  });
}
