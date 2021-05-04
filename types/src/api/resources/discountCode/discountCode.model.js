"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
var fixOrPercent;
(function (fixOrPercent) {
    fixOrPercent["fix"] = "fix";
    fixOrPercent["percent"] = "percent";
})(fixOrPercent = exports.fixOrPercent || (exports.fixOrPercent = {}));
const discountCodeSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    expirationDate: {
        type: Date,
    },
    value: {
        type: Number,
        required: true,
        default: 0,
    },
    type: {
        type: String,
        enum: ['fix', 'percent'],
    },
    limit: Number,
    timesUsed: Number,
}, { timestamps: true });
discountCodeSchema.pre('save', function (next) {
    if (this.value > 100 && this.type === 'percent') {
        next(new Error('percent value cannot be more than 100'));
    }
    else if (this.expirationDate && moment_1.default(this.expirationDate).isBefore(moment_1.default())) {
        next(new Error('Expiration date cannot be in past'));
    }
    else {
        next();
    }
});
exports.discountCodeModel = mongoose_1.model('discountCode', discountCodeSchema);
//# sourceMappingURL=discountCode.model.js.map