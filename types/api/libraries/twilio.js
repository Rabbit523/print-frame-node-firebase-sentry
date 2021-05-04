"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const config_1 = require("../../config");
//TODO: move all the phone numbers to option model
const client = twilio_1.default(config_1.default.accounts.TWILIO_SID, config_1.default.secrets.TWILIO_TOKEN);
/**
 * Sends sms to the customer
 * @param {number} to - the number to send the sms to
 * @param {string} msg - the text message that will be send to customer phone
 */
exports.sendSms = async (to, msg) => {
    try {
        const lookUp = await client.lookups
            .phoneNumbers(to + "")
            .fetch({ type: ["carrier"] });
        if (lookUp.countryCode === "US") {
            await client.messages.create({
                body: msg,
                from: config_1.default.TWILIO_NUMBER,
                to: to + ""
            });
            return true;
        }
        return false;
    }
    catch (e) {
        console.log(e);
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