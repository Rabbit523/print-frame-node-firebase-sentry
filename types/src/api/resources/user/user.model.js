"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const generalInterfaces_1 = require("../../generalInterfaces");
const userSchema = new mongoose_1.Schema({
    userEmail: {
        type: String,
        unique: true,
    },
    salutation: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required: true,
    },
    userUid: {
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
}, { timestamps: true });
exports.userModel = mongoose_1.model('user', userSchema);
//# sourceMappingURL=user.model.js.map