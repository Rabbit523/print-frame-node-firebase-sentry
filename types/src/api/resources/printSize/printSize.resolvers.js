"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const generalInterfaces_1 = require("../../generalInterfaces");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const Sentry = __importStar(require("@sentry/node"));
const getAllPrintSizes = async (source, args, { Models: { printSizeModel } }) => {
    const total = await printSizeModel.countDocuments({}, (err, count) => {
        if (err)
            throw new err();
        return count;
    });
    const printSizes = await printSizeModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { printSizes, total };
};
const getOnePrintSize = async (obj, { input: { id } }, { Models: { printSizeModel } }) => {
    const res = await printSizeModel.findById(id).exec();
    return res;
};
const createPrintSize = async (obj, { input }, { Models: { printSizeModel } }) => {
    return printSizeModel.create(input);
};
const createMultiplePrintSizes = async (obj, { input }, { Models: { printSizeModel } }) => {
    try {
        const res = await printSizeModel.create(input);
        return res;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
const deletePrintSize = async (obj, { input: { id } }, { Models: { printSizeModel } }) => {
    try {
        await printSizeModel.findByIdAndRemove(id, { disabled: true }).exec();
        return true;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
const updatePrintSize = async (obj, { input }, { Models: { printSizeModel } }) => {
    try {
        const printSize = await printSizeModel.findByIdAndUpdate(input.id, input, { new: true }).exec();
        return printSize;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
exports.printSizeResolvers = {
    Query: {
        getAllPrintSizes: auth_resolvers_1.authenticated(getAllPrintSizes),
        getOnePrintSize: auth_resolvers_1.authenticated(getOnePrintSize),
    },
    Mutation: {
        createPrintSize: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createPrintSize)),
        createMultiplePrintSizes: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createMultiplePrintSizes)),
        updatePrintSize: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updatePrintSize)),
        deletePrintSize: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deletePrintSize)),
    },
};
//# sourceMappingURL=printSize.resolvers.js.map