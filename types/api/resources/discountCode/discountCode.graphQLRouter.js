"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.discountCodeType = fs_1.readFileSync(__dirname + "/discountCode.graphql", "utf8");
var discountCode_resolvers_1 = require("./discountCode.resolvers");
exports.discountCodeResolvers = discountCode_resolvers_1.discountCodeResolvers;
//# sourceMappingURL=discountCode.graphQLRouter.js.map