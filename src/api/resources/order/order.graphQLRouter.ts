import { readFileSync } from 'fs';
export const orderType = readFileSync(__dirname + '/order.graphql', 'utf8');
export { orderResolvers } from './order.resolvers';
