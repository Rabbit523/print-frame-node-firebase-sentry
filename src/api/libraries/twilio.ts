import Twilio from 'twilio';
import config from '../../config';
import * as Sentry from '@sentry/node';

//TODO: move all the phone numbers to option model
const client = Twilio(config.accounts.TWILIO_SID, config.secrets.TWILIO_TOKEN);

/**
 * Sends sms to the customer
 * @param {number} to - the number to send the sms to
 * @param {string} msg - the text message that will be send to customer phone
 */
export const sendSms = async (to: number, msg: string): Promise<boolean> => {
  try {
    const lookUp = await client.lookups.phoneNumbers(to + '').fetch({ type: ['carrier'] });
    if (lookUp.countryCode === 'US') {
      await client.messages.create({
        body: msg,
        from: config.TWILIO_NUMBER,
        to: to + '',
      });
      return true;
    }
    return false;
  } catch (e) {
    Sentry.captureException(e);
    return false;
  }
};

/**
 * sends sms when new order created
 * @param {string} orderId
 * @param {number} phoneNumber
 */
export const newOrder = async (orderId: string, phoneNumber: number): Promise<boolean> => {
  const msg = `we received your order ${orderId} at PrintAndFrameIt. you can check the status of your order at printandframeit.com`;
  return sendSms(phoneNumber, msg);
};
/**
 * sends sms when order has been shipped
 * @param {sting} orderId
 * @param {number} phoneNumber
 */
export const orderShipped = async (orderId: string, phoneNumber: number) => {
  const msg = `your order ${orderId} has been shipped. you can track the shipment at printandframeit.com`;
  return sendSms(phoneNumber, msg);
};
