"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.orderType = fs_1.readFileSync(__dirname + "/order.graphql", "utf8");
var order_resolvers_1 = require("./order.resolvers");
exports.orderResolvers = order_resolvers_1.orderResolvers;
//# sourceMappingURL=order.graphQLRouter.js.map