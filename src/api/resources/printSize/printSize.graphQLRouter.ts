import { readFileSync } from 'fs';
export const printSizeType = readFileSync(__dirname + '/printSize.graphql', 'utf8');
export { printSizeResolvers } from './printSize.resolvers';
