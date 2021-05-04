"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const order_model_1 = require("../order/order.model");
const uploadPath = path_1.default.join(__dirname, '/../../../../uploads');
exports.imageControler = {
    getImage: () => { },
    getEdittedImage: () => { },
};
exports.imageControler.getImage = async (req, res, next) => {
    try {
        const myOrder = await order_model_1.orderModel.findOne({ orderId: req.params.orderId }).exec();
        if (!myOrder)
            throw new Error('order not found');
        const img = myOrder.images.find(img => img.name === req.params.imageName);
        if (!img)
            throw new Error('Image not found');
        const file = path_1.default.join(uploadPath, myOrder.orderFolder, img.name + '.' + img.extension);
        res.sendFile(file);
    }
    catch (e) {
        next(e);
    }
};
exports.imageControler.getEdittedImage = async (req, res, next) => {
    try {
        const myOrder = await order_model_1.orderModel.findOne({ orderId: req.params.orderId }).exec();
        if (!myOrder)
            throw new Error('order not found');
        const img = myOrder.images.find(img => img.name === req.params.imageName);
        if (!img)
            throw new Error('Image not found');
        const file = path_1.default.join(uploadPath, myOrder.orderFolder, img.name + '-final.' + img.extension);
        res.sendFile(file);
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=image.controler.js.map