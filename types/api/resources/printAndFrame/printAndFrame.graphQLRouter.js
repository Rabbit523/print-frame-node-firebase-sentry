"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.printAndFrameType = fs_1.readFileSync(__dirname + "/printAndFrame.graphql", "utf8");
var printAndFrame_resolvers_1 = require("./printAndFrame.resolvers");
exports.printAndFrameResolvers = printAndFrame_resolvers_1.printAndFrameResolvers;
//# sourceMappingURL=printAndFrame.graphQLRouter.js.map