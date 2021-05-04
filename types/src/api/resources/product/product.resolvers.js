"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lo = __importStar(require("lodash"));
const error_1 = require("../error");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const generalInterfaces_1 = require("../../generalInterfaces");
const Sentry = __importStar(require("@sentry/node"));
const getProductByUri = async (obj, { input }, { Models: { productModel } }) => {
    try {
        const product = await productModel.findOne({ uri: input }).exec();
        return product;
    }
    catch (e) {
        return null;
    }
};
const deleteProductImage = async (obj, { input }, { Models: { productModel } }) => {
    try {
        const res = await productModel.updateOne({ _id: input.id }, { $pull: { images: { _id: input.imageId } } });
        return true;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
const deleteProductSize = async (obj, { input }, { Models: { productModel } }) => {
    try {
        const res = await productModel.updateOne({ _id: input.id }, { $pull: { sizes: { _id: input.sizeId } } });
        return true;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
const createProductImage = async (obj, { input }, { Models: { productModel } }) => {
    try {
        const product = await productModel.findById(input.id).exec();
        if (!product)
            return false;
        product.images.push(...input.images);
        await product.save();
        return true;
    }
    catch (e) {
        return false;
    }
};
const createProductSizes = async (obj, { input }, { Models: { productModel } }) => {
    try {
        const product = await productModel.findById(input.id).exec();
        if (!product)
            return false;
        product.sizes.push(...input.sizes);
        await product.save();
        return true;
    }
    catch (e) {
        Sentry.captureException('error is' + e);
        return false;
    }
};
const getOne = async (obj, { input: { id } }, { Models: { productModel } }) => {
    const product = await productModel.findById(id).exec();
    if (!product)
        throw new error_1.noProductFoundError();
    return product;
};
const allProducts = async (obj, args, { Models: { productModel } }) => {
    try {
        const total = await productModel.countDocuments({}, (err, count) => {
            return count;
        });
        const products = await productModel
            .find({})
            .skip(args.input.offset)
            .limit(args.input.limit)
            .exec();
        return { products, total };
    }
    catch (e) {
        Sentry.captureException('product retrieval failed ' + e);
    }
    return false;
};
const createProduct = async (obj, { input }, { Models: { productModel } }) => {
    try {
        console.log(input);
        const product = await productModel.create(input);
        return product;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
const updateProduct = async (obj, { input }, { Models: { productModel } }) => {
    const product = await productModel.findById(input.id).exec();
    lo.merge(product, input);
    return await product.save();
};
const deleteProduct = async (obj, { input: { id } }, { Models: { productModel } }) => {
    try {
        await productModel.findByIdAndRemove(id).exec();
        return true;
    }
    catch (e) {
        throw new Error('could not delete the product');
    }
};
exports.productResolvers = {
    Query: {
        getProduct: getOne,
        getAllProducts: allProducts,
        getProductByUri,
    },
    Mutation: {
        createProduct: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createProduct)),
        updateProduct: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updateProduct)),
        deleteProduct: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteProduct)),
        deleteProductImage: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteProductImage)),
        deleteProductSize: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteProductSize)),
        createProductImage: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createProductImage)),
        createProductSizes: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createProductSizes)),
    },
};
//# sourceMappingURL=product.resolvers.js.map