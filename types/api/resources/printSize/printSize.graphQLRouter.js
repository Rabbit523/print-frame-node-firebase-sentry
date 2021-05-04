"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.printSizeType = fs_1.readFileSync(__dirname + "/printSize.graphql", "utf8");
var printSize_resolvers_1 = require("./printSize.resolvers");
exports.printSizeResolvers = printSize_resolvers_1.printSizeResolvers;
//# sourceMappingURL=printSize.graphQLRouter.js.map