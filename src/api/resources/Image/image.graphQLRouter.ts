import { readFileSync } from 'fs';
export const imageType = readFileSync(__dirname + '/image.graphql', 'utf8');
export { imageResolvers } from './image.resolvers';
