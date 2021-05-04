"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const printAndFrameSchema = new mongoose_1.default.Schema({
    frameName: {
        type: String,
        required: true
    },
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
    disabled: {
        type: Number,
        required: true,
        default: false
    },
    frameUrl: {
        type: String,
        required: true
    },
    margin: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });
exports.printAndFrameModel = mongoose_1.default.model("printAndFrame", printAndFrameSchema);
//# sourceMappingURL=printAndFrame.model.js.map