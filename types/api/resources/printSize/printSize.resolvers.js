"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../auth/auth.controller");
const error_1 = require("../error");
const getAllPrintSizes = async (source, args, ctx) => {
    const total = await ctx.Models.printSizeModel.countDocuments({}, (err, count) => {
        if (err)
            throw new err();
        return count;
    });
    const printSizes = await ctx.Models.printSizeModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { printSizes, total };
};
const getOnePrintSize = async (obj, { input: { id } }, ctx) => {
    const res = await ctx.Models.printSizeModel.findById(id).exec();
    return res;
};
const createPrintSize = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    return await ctx.Models.printSizeModel.create(input);
};
const deletePrintSize = async (obj, { input: { id } }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    try {
        const printSize = await ctx.Models.printSizeModel
            .findByIdAndUpdate(id, { disabled: true })
            .exec();
        return {
            id,
            err: 0
        };
    }
    catch (e) {
        throw new Error(e);
    }
};
const updatePrintSize = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    try {
        const printSize = await ctx.Models.printSizeModel
            .findByIdAndUpdate(input.id, input, { new: true })
            .exec();
        return printSize;
    }
    catch (e) {
        // console.log(e);
        throw new Error(e);
    }
};
exports.printSizeResolvers = {
    Query: {
        getAllPrintSizes,
        getOnePrintSize
    },
    Mutation: {
        createPrintSize,
        updatePrintSize,
        deletePrintSize
    }
};
//# sourceMappingURL=printSize.resolvers.js.map