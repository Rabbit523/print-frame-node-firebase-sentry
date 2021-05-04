import { readFileSync } from 'fs';
export const discountCodeType = readFileSync(__dirname + '/discountCode.graphql', 'utf8');
export { discountCodeResolvers } from './discountCode.resolvers';
