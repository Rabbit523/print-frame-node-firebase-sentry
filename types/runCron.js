"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CronJob = require("cron").CronJob;
const order_model_1 = require("./api/resources/order/order.model");
const moment_1 = require("moment");
const image_model_1 = require("./api/resources/Image/image.model");
//TODO: fix the env key for aws keys
exports.cron = new CronJob("00 00 00 * * *", async function () {
    const pasDueOpen = await order_model_1.orderModel
        .find({
        updatedAt: { $lt: moment_1.default().subtract("days", 30) }
    })
        .exec();
    pasDueOpen.map(async (order) => {
        const expiredImages = await image_model_1.imageModel.find({ orderId: order.id });
        expiredImages.map(async (img) => { });
    });
}, null, true, "America/Los_Angeles");
//# sourceMappingURL=runCron.js.map