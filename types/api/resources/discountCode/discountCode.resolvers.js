"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../auth/auth.controller");
const error_1 = require("../error");
const moment = require("moment");
const isValidDiscountCode = async (source, { input: { code } }, ctx) => {
    if (!code) {
        return "";
    }
    const [res] = await ctx.Models.discountCodeModel.find({ code }).exec();
    if (!res ||
        moment(res.expirationDate).isBefore(moment()) ||
        res.timesUsed > res.limit) {
        throw new Error("not valid code");
    }
    return { value: res.value, type: res.type };
};
const getAllDiscountCodes = async (source, args, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    const total = await ctx.Models.discountCodeModel.countDocuments({}, (err, count) => {
        if (err)
            throw new err();
        return count;
    });
    const discountCodes = await ctx.Models.discountCodeModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { discountCodes, total };
};
const getOneDiscountCode = async (obj, { input: { id } }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    const res = await ctx.Models.discountCodeModel.findById(id).exec();
    return res;
};
const createDiscountCode = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    return await ctx.Models.discountCodeModel.create(input);
};
const deleteDiscountCode = async (obj, { input: { id } }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    if (!id) {
        throw new Error("id not provided");
    }
    try {
        await ctx.Models.discountCodeModel.findByIdAndRemove(id).exec();
        return {
            id,
            err: 0
        };
    }
    catch (e) {
        throw new Error(e);
    }
};
const updateDiscountCode = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    if (!input.id) {
        throw new Error("id not provided");
    }
    try {
        const discountCode = await ctx.Models.discountCodeModel
            .findByIdAndUpdate(input.id, input, { new: true })
            .exec();
        return discountCode;
    }
    catch (e) {
        // console.log(e);
        throw new Error(e);
    }
};
exports.discountCodeResolvers = {
    Query: {
        getAllDiscountCodes,
        getOneDiscountCode,
        isValidDiscountCode
    },
    Mutation: {
        createDiscountCode,
        updateDiscountCode,
        deleteDiscountCode
    }
};
//# sourceMappingURL=discountCode.resolvers.js.map