"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const generalInterfaces_1 = require("../../generalInterfaces");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const Sentry = __importStar(require("@sentry/node"));
const isValidDiscountCode = async (source, { input: { code } }, { Models: { discountCodeModel } }) => {
    if (!code) {
        return '';
    }
    const [res] = await discountCodeModel.find({ code }).exec();
    if (!res || moment_1.default(res.expirationDate).isBefore(moment_1.default()) || res.timesUsed > res.limit) {
        Sentry.captureException('not valid code');
    }
    return { value: res.value, type: res.type };
};
const getAllDiscountCodes = async (source, args, { Models: { discountCodeModel } }) => {
    const total = await discountCodeModel.countDocuments({}, (err, count) => {
        if (err)
            Sentry.captureException(err);
        return count;
    });
    const discountCodes = await discountCodeModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { discountCodes, total };
};
const getOneDiscountCode = async (obj, { input: { id } }, { Models: { discountCodeModel } }) => {
    const res = await discountCodeModel.findById(id).exec();
    return res;
};
const createDiscountCode = async (obj, { input }, { Models: { discountCodeModel } }) => {
    return await discountCodeModel.create(input);
};
const deleteDiscountCode = async (obj, { input: { id } }, { Models: { discountCodeModel } }) => {
    if (!id) {
        Sentry.captureException('id not provided');
    }
    try {
        await discountCodeModel.findByIdAndRemove(id).exec();
        return true;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
const updateDiscountCode = async (obj, { input }, { Models: { discountCodeModel } }) => {
    if (!input.id) {
        Sentry.captureException('id not provided');
    }
    try {
        const discountCode = await discountCodeModel.findByIdAndUpdate(input.id, input, { new: true }).exec();
        return discountCode;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
exports.discountCodeResolvers = {
    Query: {
        getAllDiscountCodes: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getAllDiscountCodes)),
        getOneDiscountCode: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getOneDiscountCode)),
        isValidDiscountCode: auth_resolvers_1.authenticated(isValidDiscountCode),
    },
    Mutation: {
        createDiscountCode: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createDiscountCode)),
        updateDiscountCode: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updateDiscountCode)),
        deleteDiscountCode: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteDiscountCode)),
    },
};
//# sourceMappingURL=discountCode.resolvers.js.map