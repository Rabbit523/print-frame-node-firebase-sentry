"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = require("lodash.merge");
const apollo_server_express_1 = require("apollo-server-express");
const user_1 = require("./resources/user");
const option_1 = require("./resources/option");
const auth_1 = require("./resources/auth");
const Image_1 = require("./resources/Image");
const order_1 = require("./resources/order");
const product_1 = require("./resources/product");
const printAndFrame_1 = require("./resources/printAndFrame");
const printSize_1 = require("./resources/printSize");
const discountCode_1 = require("./resources/discountCode");
const misc_1 = require("./resources/misc");
// import "./libraries/authorizenet";
// import "./libraries/easyPost";
require("./libraries/pdfGenerator");
// Definig root for graphql
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
        auth_1.authType,
        option_1.optionType,
        printAndFrame_1.printAndFrameType,
        Image_1.imageType,
        order_1.orderType,
        product_1.productType,
        printSize_1.printSizeType,
        discountCode_1.discountCodeType,
        misc_1.miscType
    ].join(" "),
    resolvers: lodash_merge_1.default({}, auth_1.authResolvers, user_1.userResolvers, auth_1.authResolvers, option_1.optionResolvers, printAndFrame_1.printAndFrameResolvers, Image_1.imageResolvers, order_1.orderResolvers, product_1.productResolvers, printSize_1.printSizeResolvers, discountCode_1.discountCodeResolvers, misc_1.miscResolvers)
};
//we use this export for tests
exports.Models = {
    userModel: user_1.userModel,
    userMeta: user_1.userMeta,
    authModel: auth_1.authModel,
    optionModel: option_1.optionModel,
    orderModel: order_1.orderModel,
    imageModel: Image_1.imageModel,
    productModel: product_1.productModel,
    printAndFrameModel: printAndFrame_1.printAndFrameModel,
    printSizeModel: printSize_1.printSizeModel,
    discountCodeModel: discountCode_1.discountCodeModel
};
exports.graphQLServer = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.structure.typeDefs,
    resolvers: exports.structure.resolvers,
    context: ({ req, res }) => ({
        req,
        res,
        Models: exports.Models
    }),
    playground: {
        settings: {
            "editor.theme": "dark"
        }
    },
    tracing: false
});
//# sourceMappingURL=graphQLRouter.js.map