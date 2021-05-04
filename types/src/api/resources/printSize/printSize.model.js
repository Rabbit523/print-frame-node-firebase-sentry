"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const printSizeSchema = new mongoose_1.Schema({
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
    framePrice: {
        type: Number,
        required: true,
        default: 0,
    },
    hasFrame: {
        type: Boolean,
        required: true,
        default: false,
    },
    margin: {
        type: Number,
        required: true,
        default: 0,
    },
    frameMargin: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingHeight: {
        type: Number,
        required: true,
    },
    shippingLength: {
        type: Number,
        required: true,
    },
    shippingWidth: {
        type: Number,
        required: true,
    },
    shippingWeight: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
printSizeSchema.index({ width: 1, height: 1, disabled: 1 }, { unique: true });
exports.printSizeModel = mongoose_1.model('printSize', printSizeSchema);
//# sourceMappingURL=printSize.model.js.map