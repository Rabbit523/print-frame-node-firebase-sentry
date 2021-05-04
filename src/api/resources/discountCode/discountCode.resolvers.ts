import moment from 'moment';
import { IDiscountCode } from './discountCode.model';
import { userRoles, orderStatus } from '../../generalInterfaces';
import { authorized, authenticated } from '../auth/auth.resolvers';
import * as Sentry from '@sentry/node';
import { IOrder } from '../order/order.model';
import { getMyOrder } from '../utils/orderUtils';

const isValidDiscountCode = async (
  source: any,
  { input: { code } }: { input: { code: string } },
  { user, Models: { discountCodeModel, orderModel } },
) => {
  try {
    const res = await discountCodeModel.findOne({ code }).exec();
    const myOrder: IOrder | null = await getMyOrder(user, orderModel);
    if (!myOrder) throw new Error('Order not found');
    if (!res || moment(res.expirationDate).isBefore(moment()) || res.timesUsed > res.limit) {
      myOrder.DiscountCode = code;
      myOrder.DiscountCodeType = undefined;
      myOrder.DiscountCodeValue = 0;
      await myOrder.save();
      return { value: '', type: '' };
    } else {
      myOrder.DiscountCode = code;
      myOrder.DiscountCodeType = res.type;
      myOrder.DiscountCodeValue = res.value;
      await myOrder.save();
      return { value: res.value, type: res.type };
    }
  } catch (e) {
    console.log(e);
    throw new Error('Cannot apply discount code');
  }
};
const getAllDiscountCodes = async (
  source: any,
  args: { input: { offset: number; limit: number } },
  { Models: { discountCodeModel } },
) => {
  const total = await discountCodeModel.countDocuments({}, (err, count: number) => {
    if (err) Sentry.captureException(err);
    return count;
  });
  const discountCodes = await discountCodeModel
    .find({})
    .skip(args.input.offset)
    .limit(args.input.limit)
    .exec();
  return { discountCodes, total };
};

const getOneDiscountCode = async (
  obj: any,
  { input: { id } }: { input: { id: string } },
  { Models: { discountCodeModel } },
) => {
  const res = await discountCodeModel.findById(id).exec();
  return res;
};

const createDiscountCode = async (obj: any, { input }: { input: IDiscountCode }, { Models: { discountCodeModel } }) => {
  return await discountCodeModel.create(input);
};
const deleteDiscountCode = async (
  obj: any,
  { input: { id } }: { input: { id: string } },
  { Models: { discountCodeModel } },
) => {
  if (!id) {
    Sentry.captureException('id not provided');
  }
  try {
    await discountCodeModel.findByIdAndRemove(id).exec();
    return true;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};

const updateDiscountCode = async (obj: any, { input }: { input: IDiscountCode }, { Models: { discountCodeModel } }) => {
  if (!input.id) {
    Sentry.captureException('id not provided');
  }
  try {
    if (!input.id) throw new Error('id not provided');

    const discountCode = await discountCodeModel.findByIdAndUpdate(input.id, input, { new: true }).exec();
    if (!discountCode) throw new Error('Discount code not found');
    return discountCode;
  } catch (e) {
    Sentry.captureException(e);
  }
};
export const discountCodeResolvers = {
  Query: {
    getAllDiscountCodes: authenticated(authorized(userRoles.admin, getAllDiscountCodes)),
    getOneDiscountCode: authenticated(authorized(userRoles.admin, getOneDiscountCode)),
  },
  Mutation: {
    isValidDiscountCode: authenticated(isValidDiscountCode),
    createDiscountCode: authenticated(authorized(userRoles.admin, createDiscountCode)),
    updateDiscountCode: authenticated(authorized(userRoles.admin, updateDiscountCode)),
    deleteDiscountCode: authenticated(authorized(userRoles.admin, deleteDiscountCode)),
  },
};
