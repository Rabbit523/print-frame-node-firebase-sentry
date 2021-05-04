"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphQLRouter_1 = require("../src/api/graphQLRouter");
const apollo_server_1 = require("apollo-server");
const apollo_server_testing_1 = require("apollo-server-testing");
exports.createTestServer = ctx => {
    const server = new apollo_server_1.ApolloServer({
        typeDefs: graphQLRouter_1.structure.typeDefs,
        resolvers: graphQLRouter_1.structure.resolvers,
        mockEntireSchema: false,
        mocks: true,
        context: () => ctx,
    });
    return apollo_server_testing_1.createTestClient(server);
};
//# sourceMappingURL=run.js.map