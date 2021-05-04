"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lo = __importStar(require("lodash"));
const error_1 = require("../error");
const mongoose_1 = __importDefault(require("mongoose"));
const generalInterfaces_1 = require("../../generalInterfaces");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const Sentry = __importStar(require("@sentry/node"));
const createOption = async (obj, args, { Models: { optionModel } }) => {
    return optionModel.create(args.input);
};
const createOptions = async (obj, args, { Models: { optionModel } }) => {
    return optionModel.create(args.input);
};
/**
 * Get one option with the option Key
 */
const getOneOption = async (obj, { input: { optionKey } }, { Models: { optionModel } }) => {
    return await optionModel.findOne({
        optionId: optionKey,
    });
};
const getAllOptions = async (obj, args, { Models: { optionModel } }) => {
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
    }
    catch (e) {
        Sentry.captureException('Error getting options' + e);
        throw new e();
    }
};
const updateOption = async (obj, { input }, { Models: { optionModel } }) => {
    if (!input.id) {
        throw new error_1.noOptionFoundError();
    }
    try {
        const id = input.id;
        const option = await optionModel.findById(id).exec();
        if (option) {
            lo.merge(option, input);
            return option.save();
        }
        return option;
    }
    catch (e) {
        throw new e();
    }
};
const deleteOption = async (obj, { input: { id } }, { Models: { optionModel } }) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('option id is not valid');
    }
    try {
        await optionModel.findByIdAndRemove(id).exec();
        return true;
    }
    catch (e) {
        throw new Error('We could not delete the option');
    }
};
exports.optionResolvers = {
    Query: {
        getOption: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getOneOption)),
        getAllOptions: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, getAllOptions)),
    },
    Mutation: {
        createOption: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createOption)),
        createOptions: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createOptions)),
        updateOption: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, updateOption)),
        deleteOption: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, deleteOption)),
    },
};
//# sourceMappingURL=option.resolvers.js.map