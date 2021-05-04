import { readFileSync } from 'fs';

export const optionType = readFileSync(__dirname + '/option.graphql', 'utf8');
export { optionResolvers } from './option.resolvers';
