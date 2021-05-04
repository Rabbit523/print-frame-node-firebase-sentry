"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const printSizeSchema = new mongoose_1.default.Schema({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    widthHeight: {
        type: Number,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });
exports.printSizeModel = mongoose_1.default.model("printSize", printSizeSchema);
//# sourceMappingURL=printSize.model.js.map