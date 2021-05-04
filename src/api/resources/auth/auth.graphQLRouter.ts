import { readFileSync } from 'fs';
export const authType = readFileSync(__dirname + '/auth.graphql', 'utf8');
export { authResolvers } from './auth.resolvers';
