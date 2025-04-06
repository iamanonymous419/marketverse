import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from '@/graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import type { NextRequest } from 'next/server';

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a properly formatted handler
const handler = startServerAndCreateNextHandler(server);

// Correct function signature for Next.js App Router
export async function GET(req: NextRequest): Promise<Response> {
  return handler(req);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req);
}
