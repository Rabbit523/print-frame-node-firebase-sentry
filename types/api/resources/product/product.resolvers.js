"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lo = require("lodash");
const error_1 = require("../error");
const getOne = async (obj, args, ctx, info) => {
    const product = await ctx.Models.productModel.findById(args.input.id).exec();
    if (!product) {
        throw new error_1.noProductFoundError();
    }
    return product;
};
const allProducts = async (obj, args, ctx, info) => {
    const total = await ctx.Models.productModel.countDocuments({}, (err, count) => {
        return count;
    });
    const products = ctx.Models.productModel
        .find({})
        .skip(args.input.offset)
        .limit(args.input.limit)
        .exec();
    return { products, total };
};
const createProduct = (obj, args, ctx, info) => {
    const product = ctx.Models.productModel.create(args.input);
    return product;
};
const updateProduct = async (obj, args, ctx, info) => {
    const productId = args.input.id;
    const product = await ctx.Models.productModel
        .findById(productId)
        .then(res => {
        if (!res) {
            throw new error_1.noProductFoundError();
        }
        else {
            return res;
        }
    })
        .catch(err => {
        throw new error_1.noProductFoundError();
    });
    lo.merge(product, args.input);
    return product.save();
};
const deleteProduct = async (obj, args, ctx, info) => {
    const productId = args.input.id;
    const product = await ctx.Models.productModel
        .findById(productId)
        .then(res => {
        if (!res) {
            throw new error_1.noProductFoundError();
        }
        else {
            return res.remove().then(removed => {
                return {
                    id: removed._id,
                    err: 0
                };
            });
        }
    })
        .catch(err => {
        throw new error_1.noProductFoundError();
    });
    product.id = productId;
    return product;
};
exports.productResolvers = {
    Query: {
        getProduct: getOne,
        getAllProducts: allProducts
    },
    Mutation: {
        createProduct,
        updateProduct,
        deleteProduct
    }
};
//# sourceMappingURL=product.resolvers.js.map