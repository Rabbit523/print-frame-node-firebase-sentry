"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_restRouter_1 = require("../auth/auth.restRouter");
const generalInterfaces_1 = require("../../generalInterfaces");
const image_controler_1 = require("./image.controler");
exports.imageRouter = express_1.default.Router();
exports.imageRouter.get('/:orderId/:imageName', auth_restRouter_1.restAuth.authenticated, auth_restRouter_1.restAuth.authorized(generalInterfaces_1.userRoles.admin), image_controler_1.imageControler.getImage);
exports.imageRouter.get('/final/:orderId/:imageName', auth_restRouter_1.restAuth.authenticated, auth_restRouter_1.restAuth.authorized(generalInterfaces_1.userRoles.admin), image_controler_1.imageControler.getEdittedImage);
exports.default = exports.imageRouter;
//# sourceMappingURL=image.restRouter.js.map