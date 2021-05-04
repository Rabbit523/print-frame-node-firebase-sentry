"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const generalInterfaces_1 = require("../../generalInterfaces");
const orderImageSchema = new mongoose_1.Schema({
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    imageData: {
        type: String,
    },
    finalImageData: String,
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    isBlackAndWite: {
        type: Boolean,
        required: true,
        default: false,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    name: {
        type: String,
        required: true,
    },
    EditX: Number,
    EditY: Number,
    EditWidth: Number,
    EditHeight: Number,
    printWidth: Number,
    printHeight: Number,
    frameName: {
        type: String,
        default: '',
    },
}, { timestamps: true });
const orderFrameSchema = new mongoose_1.Schema({
    frameName: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    frameId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    shippingHeight: {
        type: Number,
        required: true,
    },
    shippingWidth: {
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
    price: {
        type: Number,
        required: true,
    },
    shippingLabelUrl: {
        type: String,
    },
    shippingLabelId: {
        type: String,
    },
    shippingPrice: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
}, { timestamps: true });
const orderFramedImageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    imageData: {
        type: String,
    },
    isBlackAndWite: {
        type: Boolean,
        required: true,
        default: false,
    },
    frameName: {
        type: String,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    shippingHeight: {
        type: Number,
        required: true,
    },
    shippingWidth: {
        type: Number,
        required: true,
    },
    shippingLength: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    shippingLabelUrl: {
        type: String,
        required: true,
    },
    shippingLabelId: {
        type: String,
        required: true,
    },
    shippingPrice: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
}, { timestamps: true });
const orderSchema = new mongoose_1.Schema({
    paymentDate: {
        type: Date,
    },
    shipmentDate: {
        type: Date,
    },
    orderStatus: {
        type: String,
        enum: ['started', 'cancelled', 'refunded', 'paymentFailed', 'pendingShipment', 'shipped'],
        default: 'started',
    },
    orderFolder: {
        type: String,
        required: true,
    },
    shippingAddress: {
        name: String,
        street1: String,
        street2: String,
        city: String,
        zipCode: Number,
        country: String,
        state: {
            type: String,
            enum: generalInterfaces_1.statesArray,
        },
    },
    billingAddress: {
        name: String,
        street1: String,
        street2: String,
        city: String,
        zipCode: Number,
        country: String,
        state: {
            type: String,
            enum: generalInterfaces_1.statesArray,
        },
    },
    orderTotal: {
        type: Number,
        required: true,
        default: 0,
    },
    tax: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userEmail: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    notes: {
        type: String,
    },
    salutation: {
        type: String,
    },
    orderId: {
        type: String,
        unique: true,
    },
    shippingLabelUrl: {
        type: String,
    },
    shippingLabelId: {
        type: String,
    },
    DiscountCode: {
        type: String,
        default: '',
    },
    DiscountCodeValue: {
        type: String,
        default: '',
    },
    DiscountCodeType: {
        type: String,
        default: '',
    },
    images: [orderImageSchema],
    frames: [orderFrameSchema],
    framedImage: [orderFramedImageSchema],
    authCode: String,
    accountNumber: String,
    transId: String,
}, { timestamps: true });
orderSchema.pre('save', function (next) {
    if (this.orderId) {
        return next();
    }
    this.orderId = Math.floor(Math.random() * 10000000000000000);
    next();
});
exports.orderModel = mongoose_1.model('order', orderSchema);
//# sourceMappingURL=order.model.js.map