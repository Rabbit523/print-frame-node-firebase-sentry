"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../../server");
const error_1 = require("../error");
const generalInterfaces_1 = require("../../generalInterfaces");
const moment_1 = __importDefault(require("moment"));
const Sentry = __importStar(require("@sentry/node"));
exports.getUserFromToken = async (token) => {
    return await server_1.FireBaseAdmin.auth().verifyIdToken(token);
};
exports.authenticated = next => async (root, args, ctx, info) => {
    if (process.env.NODE_ENV === 'test')
        return next(root, args, ctx, info);
    try {
        const token = ctx.req.get('Authorization');
        // console.log('token \n', token);
        if (!token)
            throw new error_1.unauthorizedAccessError();
        const user = exports.getUserFromToken(token);
        if (!user)
            throw new error_1.unauthorizedAccessError();
        return next(root, args, { ...ctx, user }, info);
    }
    catch (e) {
        Sentry.captureException('There is an auth error' + e);
        throw new error_1.unauthorizedAccessError();
    }
};
exports.authorized = (role, next) => async (root, args, ctx, info) => {
    if (process.env.NODE_ENV === 'test')
        return next(root, args, ctx, info);
    try {
        const user = await ctx.user;
        //TODO:make this more usable
        if (user.email === 'dumitru@seodapop.com') {
            server_1.FireBaseAdmin.auth().setCustomUserClaims(user.uid, {
                role: generalInterfaces_1.userRoles.superAdmin,
            });
        }
        const userRole = user.role;
        if (userRole >= role) {
            return next(root, args, ctx, info);
        }
        else {
            throw new error_1.AccessDeniedError();
        }
    }
    catch (e) {
        throw new error_1.AccessDeniedError();
    }
};
exports.addRoleToUser = exports.authenticated(exports.authorized(generalInterfaces_1.userRoles.admin, async (root, args, ctx, info) => { }));
//This is the case when user is ananymous and then logs In
const changeOrderUid = async (root, { input: { currentUid, newUid } }, { user, Models: { orderModel } }) => {
    try {
        const reolvedUser = await user;
        const oneHour = moment_1.default()
            .subtract(1, 'hour')
            .utc();
        const userOrder = await orderModel
            .findOne({ userId: currentUid, orderStatus: generalInterfaces_1.orderStatus.started, updatedAt: { $gt: oneHour } })
            .exec();
        if (!userOrder)
            return true;
        userOrder.userId = newUid;
        userOrder.save();
    }
    catch (e) {
        Sentry.captureException('error converting user' + e);
    }
    return true;
};
exports.authResolvers = {
    Mutation: {
        changeOrderUid: exports.authenticated(exports.authorized(generalInterfaces_1.userRoles.user, changeOrderUid)),
    },
};
//# sourceMappingURL=auth.resolvers.js.map