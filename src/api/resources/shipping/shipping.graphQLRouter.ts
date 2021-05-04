import { readFileSync } from 'fs';

export const shippingType = readFileSync(__dirname + '/shipping.graphql', 'utf8');
export { shippingResolvers } from './shipping.resolvers';
