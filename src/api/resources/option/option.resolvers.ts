import * as lo from 'lodash';
import { noOptionFoundError } from '../error';
import mongoose from 'mongoose';
import { IOption } from './option.model';
import { userRoles } from '../../generalInterfaces';
import { authorized, authenticated } from '../auth/auth.resolvers';
import * as Sentry from '@sentry/node';

const createOption = async (obj, args, { Models: { optionModel } }) => {
  return optionModel.create(args.input);
};
const createOptions = async (obj: any, args, { Models: { optionModel } }) => {
  return optionModel.create(args.input);
};
/**
 * Get one option with the option Key
 */
const getOneOption = async (obj: any, { input: { optionKey } }: { input: IOption }, { Models: { optionModel } }) => {
  return await optionModel.findOne({
    optionId: optionKey,
  });
};

const getAllOptions = async (
  obj: any,
  args: { input: { offset: number; limit: number } },
  { Models: { optionModel } },
) => {
  try {
    const total = await optionModel.countDocuments({}, (err, count) => {
      if (err) {
        Sentry.captureException(err);
      }
      return count;
    });
    const options = await optionModel
      .find({})
      .skip(args.input.offset)
      .limit(args.input.limit)
      .exec();

    return { options, total };
  } catch (e) {
    Sentry.captureException('Error getting options' + e);
    throw new e();
  }
};
const updateOption = async (obj: any, { input }: { input: IOption }, { Models: { optionModel } }) => {
  if (!input.id) {
    throw new noOptionFoundError();
  }
  try {
    const id = input.id;
    const option = await optionModel.findById(id).exec();

    if (option) {
      lo.merge(option, input);
      return option.save();
    }
    return option;
  } catch (e) {
    throw new e();
  }
};
const deleteOption = async (obj: any, { input: { id } }: { input: { id: string } }, { Models: { optionModel } }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('option id is not valid');
  }
  try {
    await optionModel.findByIdAndRemove(id).exec();
    return true;
  } catch (e) {
    throw new Error('We could not delete the option');
  }
};

export const optionResolvers = {
  Query: {
    getOption: authenticated(authorized(userRoles.admin, getOneOption)),
    getAllOptions: authenticated(authorized(userRoles.admin, getAllOptions)),
  },
  Mutation: {
    createOption: authenticated(authorized(userRoles.admin, createOption)),
    createOptions: authenticated(authorized(userRoles.admin, createOptions)),
    updateOption: authenticated(authorized(userRoles.admin, updateOption)),
    deleteOption: authenticated(authorized(userRoles.admin, deleteOption)),
  },
};
