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
const server_1 = require("../../../server");
const Sentry = __importStar(require("@sentry/node"));
//TODO:This function should not be exposed here,
// We do not need to use firebase at all
// if user signs up we keep him in the mongo
// if signs up as gues then there is no need to read his info anyway
const getAllFirebaseUsers = async (source, args, ctx) => {
    var users = [];
    var total = 0;
    await server_1.FireBaseAdmin.auth()
        .listUsers()
        .then(function (listUsersResult) {
        listUsersResult.users.forEach(function (Record) {
            if (Record.emailVerified == true) {
                if (Record.customClaims) {
                    const user = {
                        uid: Record.uid,
                        email: Record.email,
                        displayName: Record.displayName,
                        customClaims: Record.customClaims.role,
                    };
                    users.push(user);
                }
                else {
                    const user = { uid: Record.uid, email: Record.email, displayName: Record.displayName, customClaims: 0 };
                    users.push(user);
                }
                total += 1;
            }
        });
    })
        .catch(function (error) {
        Sentry.captureException('Error listing users:' + error);
    });
    return { total, users };
};
const getOne = async (root, { input: { id } }, { Models: { userModel } }) => {
    const user = await userModel.find({ userUid: id }).exec;
    if (!user) {
        throw new error_1.noUserFoundError();
    }
    return user;
};
const getAll = async (root, args, { Models: { userModel } }) => {
    const total = await userModel.countDocuments({}, (err, count) => {
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
const createUser = async (root, args, { Models: { userModel } }) => {
    const user = userModel.create(args.input);
    return user;
};
const updateUser = async (root, { input }, { Models: { userModel } }) => {
    try {
        const user = await userModel.find({ userUid: input.userUid }).exec();
        lo.merge(user, input);
        return user.save();
    }
    catch (e) {
        Sentry.captureException('Error in updating user');
    }
};
const deleteUser = async (root, { input: { id } }, { Models: { userModel } }) => {
    try {
        await userModel.findOneAndDelete({ userUid: id });
        return true;
    }
    catch (e) {
        return false;
    }
};
// This should get called when user just logges in and we dont have the user in file
const createMe = async (root, { input }, { user, Models: { userModel } }) => {
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
        }
        catch (e) {
            return false;
        }
    }
    else {
        return false;
    }
};
const updateMe = async (root, { input }, { user, Models: { userModel } }) => {
    const resolvedUser = await user;
    try {
        const res = await userModel.find({ userUid: resolvedUser.uid }).exec();
        lo.merge(res, input);
        res.save();
        return true;
    }
    catch (e) {
        return false;
    }
};
const getMyInfo = async (root, {}, { user, Models: { userModel } }) => {
    const resolvedUser = await user;
    try {
        return userModel.find({ userUid: resolvedUser.uid }).exec();
    }
    catch (e) {
        Sentry.captureException('user not found');
    }
};
exports.userResolvers = {
    Query: {
        getUser: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getOne)),
        getAllUsers: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getAll)),
        getAllFirebaseUsers: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getAllFirebaseUsers)),
        getMyInfo: auth_resolvers_1.authenticated(getMyInfo),
    },
    Mutation: {
        createUser: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createUser)),
        updateUser: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updateUser)),
        deleteUser: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteUser)),
        createMe: auth_resolvers_1.authenticated(createMe),
        updateMe: auth_resolvers_1.authenticated(updateMe),
    },
};
//# sourceMappingURL=user.resolvers.js.map