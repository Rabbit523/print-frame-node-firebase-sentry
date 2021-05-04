"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const sendGrid_1 = require("./../../libraries/sendGrid");
const sendContactForm = async (source, { input }) => {
    Object.keys(input).map(key => {
        input[key] = sanitize_html_1.default(input[key]);
    });
    sendGrid_1.contactFormSubmission(input);
    return true;
};
exports.miscResolvers = {
    Mutation: {
        sendContactForm,
    },
};
//# sourceMappingURL=misc.resolvers.js.map