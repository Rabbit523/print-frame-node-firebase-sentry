"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const randomstring_1 = require("randomstring");
const generalInterfaces_1 = require("../../generalInterfaces");
const orderSchema = new mongoose_1.default.Schema({
    paymentDate: {
        type: Date
    },
    shipmentDate: {
        type: Date
    },
    orderStatus: {
        type: String,
        enum: [
            "started",
            "completed",
            "cancelled",
            "refunded",
            "paymentFailed",
            "pendingShipment"
        ],
        default: "started"
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
            enum: generalInterfaces_1.statesArray
        }
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
            enum: generalInterfaces_1.statesArray
        }
    },
    total: Number,
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        rer: "user"
    },
    orderId: {
        type: Number,
        required: true,
        unique: true,
        default: randomstring_1.default.generate({
            length: 12,
            charset: "alphabetic"
        })
    }
}, { timestamps: true });
exports.orderModel = mongoose_1.default.model("order", orderSchema);
//# sourceMappingURL=order.model.js.map