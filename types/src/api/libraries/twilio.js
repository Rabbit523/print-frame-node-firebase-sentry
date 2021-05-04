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
const twilio_1 = __importDefault(require("twilio"));
const config_1 = __importDefault(require("../../config"));
const Sentry = __importStar(require("@sentry/node"));
//TODO: move all the phone numbers to option model
const client = twilio_1.default(config_1.default.accounts.TWILIO_SID, config_1.default.secrets.TWILIO_TOKEN);
/**
 * Sends sms to the customer
 * @param {number} to - the number to send the sms to
 * @param {string} msg - the text message that will be send to customer phone
 */
exports.sendSms = async (to, msg) => {
    try {
        const lookUp = await client.lookups.phoneNumbers(to + '').fetch({ type: ['carrier'] });
        if (lookUp.countryCode === 'US') {
            await client.messages.create({
                body: msg,
                from: config_1.default.TWILIO_NUMBER,
                to: to + '',
            });
            return true;
        }
        return false;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
/**
 * sends sms when new order created
 * @param {string} orderId
 * @param {number} phoneNumber
 */
exports.newOrder = async (orderId, phoneNumber) => {
    const msg = `we received your order ${orderId} at PrintAndFrameIt. you can check the status of your order at printandframeit.com`;
    return exports.sendSms(phoneNumber, msg);
};
/**
 * sends sms when order has been shipped
 * @param {sting} orderId
 * @param {number} phoneNumber
 */
exports.orderShipped = async (orderId, phoneNumber) => {
    const msg = `your order ${orderId} has been shipped. you can track the shipment at printandframeit.com`;
    return exports.sendSms(phoneNumber, msg);
};
//# sourceMappingURL=twilio.js.map