"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    optionKey: {
        type: String,
        required: true,
        unique: true
    },
    optionValue: {
        type: String
    }
});
exports.miscModel = {};
//# sourceMappingURL=misc.model.js.map