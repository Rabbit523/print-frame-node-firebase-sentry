import { readFileSync } from 'fs';

export const miscType = readFileSync(__dirname + '/misc.graphql', 'utf8');
export { miscResolvers } from './misc.resolvers';
