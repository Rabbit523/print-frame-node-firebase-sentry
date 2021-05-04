import * as lo from 'lodash';
import { noUserFoundError } from '../error';
import { IUser } from './user.model';
import { authenticated, authorized } from '../auth/auth.resolvers';
import { userRoles, UserUpdate } from '../../generalInterfaces';
import { FireBaseAdmin } from '../../../server';
import * as Sentry from '@sentry/node';

//TODO:This function should not be exposed here,
// We do not need to use firebase at all
// if user signs up we keep him in the mongo
// if signs up as gues then there is no need to read his info anyway
const getAllFirebaseUsers = async (source: any, args: {}, ctx) => {
  var users: any = [];
  var total = 0;
  await FireBaseAdmin.auth()
    .listUsers()
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(Record) {
        if (Record.emailVerified == true) {
          if (Record.customClaims) {
            const user = {
              uid: Record.uid,
              email: Record.email,
              displayName: Record.displayName,
              customClaims: (Record.customClaims as any).role,
            };
            users.push(user);
          } else {
            const user = { uid: Record.uid, email: Record.email, displayName: Record.displayName, customClaims: 0 };
            users.push(user);
          }
          total += 1;
        }
      });
    })
    .catch(function(error) {
      Sentry.captureException('Error listing users:' + error);
    });
  return { total, users };
};
const getOne = async (root: any, { input: { id } }: { input: { id: string } }, { Models: { userModel } }) => {
  const user = await userModel.find({ userUid: id }).exec;
  if (!user) {
    throw new noUserFoundError();
  }
  return user;
};

const getAll = async (root: any, args: { input: { offset: number; limit: number } }, { Models: { userModel } }) => {
  const total = await userModel.countDocuments({}, (err, count: number) => {
    if (err) {
      Sentry.captureException(err);
    }
    return count;
  });
  const users = userModel
    .find({})
    .skip(args.input.offset)
    .limit(args.input.limit)
    .exec();
  return { users, total };
};

const createUser = async (root: any, args: { input: IUser }, { Models: { userModel } }) => {
  const user = userModel.create(args.input);
  return user;
};

const updateUser = async (root: any, { input }: { input: IUser }, { Models: { userModel } }) => {
  try {
    const user = await userModel.find({ userUid: input.userUid }).exec();
    lo.merge(user, input);
    return user.save();
  } catch (e) {
    Sentry.captureException('Error in updating user');
  }
};
const deleteUser = async (root: any, { input: { id } }: { input: { id: string } }, { Models: { userModel } }) => {
  try {
    await userModel.findOneAndDelete({ userUid: id });
    return true;
  } catch (e) {
    return false;
  }
};

// This should get called when user just logges in and we dont have the user in file
const createMe = async (root: any, { input }: any, { user, Models: { userModel } }) => {
  //Check if user is not anonymous
  const resolvedUser = await user;
  if (resolvedUser.provider_id !== 'anonymous') {
    try {
      const args = {
        userEmail: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
        userRole: user.role,
        userUid: user.uid,
      };
      await userModel.create(args);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};
const updateMe = async (root: any, { input }: { input: UserUpdate }, { user, Models: { userModel } }) => {
  const resolvedUser = await user;
  try {
    const res = await userModel.find({ userUid: resolvedUser.uid }).exec();
    lo.merge(res, input);
    res.save();
    return true;
  } catch (e) {
    return false;
  }
};
const getMyInfo = async (root: any, {}, { user, Models: { userModel } }) => {
  const resolvedUser = await user;
  try {
    return userModel.find({ userUid: resolvedUser.uid }).exec();
  } catch (e) {
    Sentry.captureException('user not found');
  }
};
export const userResolvers = {
  Query: {
    getUser: authenticated(authorized(userRoles.admin, getOne)),
    getAllUsers: authenticated(authorized(userRoles.admin, getAll)),
    getAllFirebaseUsers: authenticated(authorized(userRoles.admin, getAllFirebaseUsers)),
    getMyInfo: authenticated(getMyInfo),
  },
  Mutation: {
    createUser: authenticated(authorized(userRoles.admin, createUser)),
    updateUser: authenticated(authorized(userRoles.admin, updateUser)),
    deleteUser: authenticated(authorized(userRoles.admin, deleteUser)),
    createMe: authenticated(createMe),
    updateMe: authenticated(updateMe),
  },
};
