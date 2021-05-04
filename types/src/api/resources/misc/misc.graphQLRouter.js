"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.miscType = fs_1.readFileSync(__dirname + '/misc.graphql', 'utf8');
var misc_resolvers_1 = require("./misc.resolvers");
exports.miscResolvers = misc_resolvers_1.miscResolvers;
//# sourceMappingURL=misc.graphQLRouter.js.map