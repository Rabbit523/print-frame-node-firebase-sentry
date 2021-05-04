import { structure } from '../src/api/graphQLRouter';
import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

export const createTestServer = ctx => {
  const server = new ApolloServer({
    typeDefs: structure.typeDefs,
    resolvers: structure.resolvers,
    mockEntireSchema: false,
    mocks: true,
    context: () => ctx,
  });
  return createTestClient(server as any);
};
