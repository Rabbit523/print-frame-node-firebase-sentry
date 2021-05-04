import * as lo from 'lodash';
import { Model } from 'mongoose';
import { noProductFoundError } from '../error';
import { authorized, authenticated } from '../auth/auth.resolvers';
import { userRoles } from '../../generalInterfaces';
import { IProduct } from './product.model';
import * as Sentry from '@sentry/node';

const getProductByUri = async (obj, { input }, { Models: { productModel } }) => {
  try {
    const product = await productModel.findOne({ uri: input }).exec();
    return product;
  } catch (e) {
    return null;
  }
};

const deleteProductImage = async (
  obj,
  { input },
  { Models: { productModel } }: { Models: { productModel: Model<IProduct> } },
) => {
  try {
    const res = await productModel.updateOne({ _id: input.id }, { $pull: { images: { _id: input.imageId } } });
    return true;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};
const deleteProductSize = async (
  obj,
  { input },
  { Models: { productModel } }: { Models: { productModel: Model<IProduct> } },
) => {
  try {
    const res = await productModel.updateOne({ _id: input.id }, { $pull: { sizes: { _id: input.sizeId } } });
    return true;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};

const createProductImage = async (obj, { input }, { Models: { productModel } }) => {
  try {
    const product = await productModel.findById(input.id).exec();
    if (!product) return false;
    product.images.push(...input.images);
    await product.save();
    return true;
  } catch (e) {
    return false;
  }
};

const createProductSizes = async (obj, { input }, { Models: { productModel } }) => {
  try {
    const product = await productModel.findById(input.id).exec();
    if (!product) return false;
    product.sizes.push(...input.sizes);
    await product.save();
    return true;
  } catch (e) {
    Sentry.captureException('error is' + e);
    return false;
  }
};
const getOne = async (obj, { input: { id } }: { input: { id: string } }, { Models: { productModel } }) => {
  const product = await productModel.findById(id).exec();
  if (!product) throw new noProductFoundError();
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
  } catch (e) {
    Sentry.captureException('product retrieval failed ' + e);
  }
  return false;
};
const createProduct = async (obj, { input }, { Models: { productModel } }) => {
  try {
    const product = await productModel.create(input);
    return product;
  } catch (e) {
    console.log(e);
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
  } catch (e) {
    throw new Error('could not delete the product');
  }
};

export const productResolvers = {
  Query: {
    getProduct: getOne,
    getAllProducts: allProducts,
    getProductByUri,
  },
  Mutation: {
    createProduct: authenticated(authorized(userRoles.admin, createProduct)),
    updateProduct: authenticated(authorized(userRoles.admin, updateProduct)),
    deleteProduct: authenticated(authorized(userRoles.admin, deleteProduct)),
    deleteProductImage: authenticated(authorized(userRoles.admin, deleteProductImage)),
    deleteProductSize: authenticated(authorized(userRoles.admin, deleteProductSize)),
    createProductImage: authenticated(authorized(userRoles.admin, createProductImage)),
    createProductSizes: authenticated(authorized(userRoles.admin, createProductSizes)),
  },
};
