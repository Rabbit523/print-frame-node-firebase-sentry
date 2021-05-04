"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.shippingType = fs_1.readFileSync(__dirname + '/shipping.graphql', 'utf8');
var shipping_resolvers_1 = require("./shipping.resolvers");
exports.shippingResolvers = shipping_resolvers_1.shippingResolvers;
//# sourceMappingURL=shipping.graphQLRouter.js.map