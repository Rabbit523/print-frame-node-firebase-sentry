import merge from 'lodash.merge';
import { ApolloServer } from 'apollo-server-express';
import { userType, userResolvers, userModel } from './resources/user';
import { optionType, optionResolvers, optionModel } from './resources/option';
import { imageResolvers, imageType } from './resources/Image';
import { orderResolvers, orderType, orderModel } from './resources/order';
import { productResolvers, productType, productModel } from './resources/product';
import { printSizeResolvers, printSizeType, printSizeModel } from './resources/printSize';
import { discountCodeResolvers, discountCodeType, discountCodeModel } from './resources/discountCode';
import { miscResolvers, miscType } from './resources/misc';
import { shippingResolvers, shippingType } from './resources/shipping';
import { authResolvers, authType } from './resources/auth';

const baseSchema = `
  schema {
    query: Query,
    mutation:Mutation
  }
`;

export const structure = {
  // all the graphql files go here!!
  typeDefs: [
    baseSchema,
    userType,
    optionType,
    imageType,
    orderType,
    productType,
    printSizeType,
    discountCodeType,
    miscType,
    shippingType,
    authType,
  ].join(' '),
  resolvers: merge(
    {},
    userResolvers,
    optionResolvers,
    imageResolvers,
    orderResolvers,
    productResolvers,
    printSizeResolvers,
    discountCodeResolvers,
    miscResolvers,
    shippingResolvers,
    authResolvers,
  ),
};
//we use this export for tests
export const Models = {
  userModel,
  optionModel,
  orderModel,
  productModel,
  printSizeModel,
  discountCodeModel,
};
export const graphQLServer = new ApolloServer({
  typeDefs: structure.typeDefs,
  resolvers: structure.resolvers,
  context: ({ req, res }) => ({
    req,
    res,
    Models,
  }),
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
  },
  tracing: false,
});
