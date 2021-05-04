const CronJob = require('cron').CronJob;
import { orderModel } from './api/resources/order/order.model';
import moment from 'moment';

//TODO: fix the env key for aws keys
console.log(`*************Cron job started*****************`);

export const cron = new CronJob(
  '00 00 00 * * *',
  async function() {
    const pasDueOpen = await orderModel
      .find({
        updatedAt: { $lt: moment().subtract('days', 30) },
      })
      .exec();
    pasDueOpen.map(async order => {});
  },
  null,
  true,
  'America/Los_Angeles',
);
