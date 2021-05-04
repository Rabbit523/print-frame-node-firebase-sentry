import { readFileSync } from 'fs';
export const productType = readFileSync(__dirname + '/product.graphql', 'utf8');
export { productResolvers } from './product.resolvers';
