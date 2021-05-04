"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSizeSchema = new mongoose_1.Schema({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shippingWidth: {
        type: Number,
        required: true,
    },
    shippingHeight: {
        type: Number,
        required: true,
    },
    shippingLength: {
        type: Number,
        required: true,
    },
    shippingWeight: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
    },
});
const productImageSchema = new mongoose_1.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
});
const productSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: [true, 'product name  is nessary'],
    },
    uri: {
        type: String,
        required: [true, 'product uri  is nessary'],
        unique: true,
    },
    productSku: {
        type: String,
        required: true,
        unique: true,
    },
    productDescription: {
        type: String,
    },
    productPrice: {
        type: Number,
    },
    productQuantity: {
        type: Number,
    },
    Thumbnail: {
        type: String,
        required: true,
    },
    FramedImageThumbnail: {
        type: String,
        required: true,
    },
    FrameImageBorderWidth: {
        type: Number,
        required: true,
        default: 0,
    },
    FrameBorderWidth: {
        type: Number,
        required: true,
        default: 0,
    },
    FrameImageOutset: {
        type: Number,
        required: true,
        default: 0,
    },
    images: [productImageSchema],
    sizes: [productSizeSchema],
}, { timestamps: true });
productSchema.index({ 'sizes.width': 1, 'sizes.height': 1, productSku: 1 }, { unique: true });
exports.productModel = mongoose_1.model('product', productSchema);
//# sourceMappingURL=product.model.js.map