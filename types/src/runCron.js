"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CronJob = require('cron').CronJob;
const order_model_1 = require("./api/resources/order/order.model");
const moment_1 = __importDefault(require("moment"));
//TODO: fix the env key for aws keys
console.log(`*************Cron job started*****************`);
exports.cron = new CronJob('00 00 00 * * *', async function () {
    const pasDueOpen = await order_model_1.orderModel
        .find({
        updatedAt: { $lt: moment_1.default().subtract('days', 30) },
    })
        .exec();
    pasDueOpen.map(async (order) => { });
}, null, true, 'America/Los_Angeles');
//# sourceMappingURL=runCron.js.map