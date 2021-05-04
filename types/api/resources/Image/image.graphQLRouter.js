"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.imageType = fs_1.readFileSync(__dirname + "/image.graphql", "utf8");
var image_resolvers_1 = require("./image.resolvers");
exports.imageResolvers = image_resolvers_1.imageResolvers;
//# sourceMappingURL=image.graphQLRouter.js.map