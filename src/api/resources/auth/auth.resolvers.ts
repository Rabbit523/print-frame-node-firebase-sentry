import { FireBaseAdmin } from '../../../server';
import { unauthorizedAccessError, AccessDeniedError } from '../error';
import { userRoles, orderStatus } from '../../generalInterfaces';
import moment from 'moment';
import * as Sentry from '@sentry/node';

export const getUserFromToken = async (token: string) => {
  return await FireBaseAdmin.auth().verifyIdToken(token);
};

export const authenticated = next => async (root, args, ctx, info) => {
  if (process.env.NODE_ENV === 'test') return next(root, args, ctx, info);
  try {
    const token = ctx.req.get('Authorization');
    // console.log('token \n', token);
    if (!token) throw new unauthorizedAccessError();
    const user = getUserFromToken(token);
    if (!user) throw new unauthorizedAccessError();
    return next(root, args, { ...ctx, user }, info);
  } catch (e) {
    Sentry.captureException('There is an auth error' + e);
    throw new unauthorizedAccessError();
  }
};

export const authorized = (role: userRoles, next) => async (root, args, ctx, info) => {
  if (process.env.NODE_ENV === 'test') return next(root, args, ctx, info);
  try {
    const user = await ctx.user;
    //TODO:make this more usable
    if (user.email === 'dumitru@seodapop.com') {
      FireBaseAdmin.auth().setCustomUserClaims(user.uid, {
        role: userRoles.superAdmin,
      });
    }
    const userRole = user.role;
    if (userRole >= role) {
      return next(root, args, ctx, info);
    } else {
      throw new AccessDeniedError();
    }
  } catch (e) {
    throw new AccessDeniedError();
  }
};

export const addRoleToUser = authenticated(authorized(userRoles.admin, async (root, args, ctx, info) => {}));

//This is the case when user is ananymous and then logs In
const changeOrderUid = async (
  root: any,
  { input: { currentUid, newUid } },
  { user, Models: { orderModel } },
): Promise<boolean> => {
  try {
    const reolvedUser = await user;
    const oneHour = moment()
      .subtract(1, 'hour')
      .utc();
    const userOrder = await orderModel
      .findOne({ userId: currentUid, orderStatus: orderStatus.started, updatedAt: { $gt: oneHour } })
      .exec();
    if (!userOrder) return true;
    userOrder.userId = newUid;
    userOrder.save();
  } catch (e) {
    Sentry.captureException('error converting user' + e);
  }
  return true;
};

export const authResolvers = {
  Mutation: {
    changeOrderUid: authenticated(authorized(userRoles.user, changeOrderUid)),
  },
};
