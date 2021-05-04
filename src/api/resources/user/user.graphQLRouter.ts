import { readFileSync } from 'fs';
export const userType = readFileSync(__dirname + '/user.graphql', 'utf8');
export { userResolvers } from './user.resolvers';
