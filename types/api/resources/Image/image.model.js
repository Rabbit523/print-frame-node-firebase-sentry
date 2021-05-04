"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.default.Schema({
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    s3key: {
        type: String,
        required: true
    },
    printId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    printAndFrameId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { timestamps: true });
exports.imageModel = mongoose_1.default.model("image", imageSchema);
//# sourceMappingURL=image.model.js.map