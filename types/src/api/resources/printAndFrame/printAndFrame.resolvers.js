"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../auth/auth.controller");
const error_1 = require("../error");
const getAllPrintFrames = async (source, args, ctx) => {
    const total = await ctx.Models.printAndFrameModel.countDocuments({}, (err, count) => {
        if (err)
            throw new err();
        return count;
    });
    const printFrames = await ctx.Models.printAndFrameModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { printFrames, total };
};
const getOnePrintFrame = async (obj, { input: { id } }, ctx) => {
    const res = await ctx.Models.printAndFrameModel.findById(id).exec();
    return res;
};
const createPrintFrame = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    return await ctx.Models.printAndFrameModel.create(input);
};
const deletePrintFrame = async (obj, { input: { id } }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    try {
        await ctx.Models.printAndFrameModel
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
const updatePrintFrame = async (obj, { input }, ctx) => {
    if (!(await auth_controller_1.authCheckGraph(ctx.req, 4))) {
        throw new error_1.unauthorizedAccessError();
    }
    try {
        const printFrame = await ctx.Models.printAndFrameModel
            .findByIdAndUpdate(input.id, input, { new: true })
            .exec();
        return printFrame;
    }
    catch (e) {
        // console.log(e);
        throw new Error(e);
    }
};
exports.printAndFrameResolvers = {
    Query: {
        getAllPrintFrames,
        getOnePrintFrame
    },
    Mutation: {
        createPrintFrame,
        updatePrintFrame,
        deletePrintFrame
    }
};
//# sourceMappingURL=printAndFrame.resolvers.js.map