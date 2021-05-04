"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController = __importStar(require("./order.controller"));
const orderRouter = express_1.default.Router();
orderRouter.route('/:orderId/images/:imageName')
    /** GET /api/:orderId/images/:imageName - Get image */
    .get(orderController.get);
orderRouter.route('/:orderId/invoice')
    .get(orderController.getInvoice);
orderRouter.route('/:orderId/imagelist')
    .get(orderController.getImagelist);
exports.default = orderRouter;
//# sourceMappingURL=order.restRouter.js.map