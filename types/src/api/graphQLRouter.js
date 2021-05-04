"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const apollo_server_express_1 = require("apollo-server-express");
const user_1 = require("./resources/user");
const option_1 = require("./resources/option");
const Image_1 = require("./resources/Image");
const order_1 = require("./resources/order");
const product_1 = require("./resources/product");
const printSize_1 = require("./resources/printSize");
const discountCode_1 = require("./resources/discountCode");
const misc_1 = require("./resources/misc");
const shipping_1 = require("./resources/shipping");
const auth_1 = require("./resources/auth");
require("./libraries/imageEditor");
const baseSchema = `
  schema {
    query: Query,
    mutation:Mutation
  }
`;
exports.structure = {
    // all the graphql files go here!!
    typeDefs: [
        baseSchema,
        user_1.userType,
        option_1.optionType,
        Image_1.imageType,
        order_1.orderType,
        product_1.productType,
        printSize_1.printSizeType,
        discountCode_1.discountCodeType,
        misc_1.miscType,
        shipping_1.shippingType,
        auth_1.authType,
    ].join(' '),
    resolvers: lodash_merge_1.default({}, user_1.userResolvers, option_1.optionResolvers, Image_1.imageResolvers, order_1.orderResolvers, product_1.productResolvers, printSize_1.printSizeResolvers, discountCode_1.discountCodeResolvers, misc_1.miscResolvers, shipping_1.shippingResolvers, auth_1.authResolvers),
};
//we use this export for tests
exports.Models = {
    userModel: user_1.userModel,
    optionModel: option_1.optionModel,
    orderModel: order_1.orderModel,
    productModel: product_1.productModel,
    printSizeModel: printSize_1.printSizeModel,
    discountCodeModel: discountCode_1.discountCodeModel,
};
exports.graphQLServer = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.structure.typeDefs,
    resolvers: exports.structure.resolvers,
    context: ({ req, res }) => ({
        req,
        res,
        Models: exports.Models,
    }),
    playground: {
        settings: {
            'editor.theme': 'dark',
        },
    },
    tracing: false,
});
//# sourceMappingURL=graphQLRouter.js.map