"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendGrid_1 = require("./../../libraries/sendGrid");
const sendContactForm = async (source, { input }, ctx) => {
    sendGrid_1.contactFormSubmission(input);
    return true;
};
exports.miscResolvers = {
    Mutation: {
        sendContactForm
    }
};
//# sourceMappingURL=misc.resolvers.js.map