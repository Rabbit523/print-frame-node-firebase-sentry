import { userRoles } from '../../generalInterfaces';
import { authorized, authenticated } from '../auth/auth.resolvers';
import * as Sentry from '@sentry/node';
interface IPrintSize {
  width: Number;
  height: Number;
  price: Number;
  widthHeight: Number;
  id?: string;
}

const getAllPrintSizes = async (
  source: any,
  args: { input: { offset: number; limit: number } },
  { Models: { printSizeModel } },
) => {
  const total = await printSizeModel.countDocuments({}, (err, count: number) => {
    if (err) throw new err();
    return count;
  });
  const printSizes = await printSizeModel
    .find({})
    .skip(args.input.offset)
    .limit(args.input.limit)
    .exec();
  return { printSizes, total };
};
const getOnePrintSize = async (
  obj: any,
  { input: { id } }: { input: { id: string } },
  { Models: { printSizeModel } },
) => {
  const res = await printSizeModel.findById(id).exec();
  return res;
};

const createPrintSize = async (obj: any, { input }: { input: IPrintSize }, { Models: { printSizeModel } }) => {
  return printSizeModel.create(input);
};
const createMultiplePrintSizes = async (obj: any, { input }: { input: IPrintSize }, { Models: { printSizeModel } }) => {
  try {
    const res = await printSizeModel.create(input);

    return res;
  } catch (e) {
    Sentry.captureException(e);
  }
};
const deletePrintSize = async (
  obj: any,
  { input: { id } }: { input: { id: string } },
  { Models: { printSizeModel } },
) => {
  try {
    await printSizeModel.findByIdAndRemove(id, { disabled: true }).exec();
    return true;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};

const updatePrintSize = async (obj: any, { input }: { input: IPrintSize }, { Models: { printSizeModel } }) => {
  try {
    const printSize = await printSizeModel.findByIdAndUpdate(input.id, input, { new: true }).exec();
    return printSize;
  } catch (e) {
    Sentry.captureException(e);
  }
};

export const printSizeResolvers = {
  Query: {
    getAllPrintSizes: authenticated(getAllPrintSizes),
    getOnePrintSize: authenticated(getOnePrintSize),
  },
  Mutation: {
    createPrintSize: authenticated(authorized(userRoles.admin, createPrintSize)),
    createMultiplePrintSizes: authenticated(authorized(userRoles.admin, createMultiplePrintSizes)),
    updatePrintSize: authenticated(authorized(userRoles.admin, updatePrintSize)),
    deletePrintSize: authenticated(authorized(userRoles.admin, deletePrintSize)),
  },
};
