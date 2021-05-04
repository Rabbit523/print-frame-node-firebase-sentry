"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../src/config"));
const graphQLRouter_1 = require("../src/api/graphQLRouter");
const server_1 = require("./../src/server");
const cleanDB = async () => {
    await Object.keys(graphQLRouter_1.Models).forEach(async (key) => {
        await graphQLRouter_1.Models[key].deleteMany({});
    });
};
const connectToDB = async () => {
    // console.log('connecting to db' + config.db.Url);
    return await mongoose_1.default.connect(config_1.default.db.Url, server_1.mongooseOptions);
};
const disconnectDB = async (done = () => { }) => {
    await mongoose_1.default.disconnect(done);
};
const generateMongooseId = () => {
    return mongoose_1.default.Types.ObjectId();
};
exports.dbTools = {
    cleanDB,
    connectToDB,
    disconnectDB,
    generateMongooseId,
};
//# sourceMappingURL=db.js.map