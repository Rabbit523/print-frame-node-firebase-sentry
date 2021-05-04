/**
 * Sends sms to the customer
 * @param {number} to - the number to send the sms to
 * @param {string} msg - the text message that will be send to customer phone
 */
export declare const sendSms: (to: number, msg: string) => Promise<boolean>;
/**
 * sends sms when new order created
 * @param {string} orderId
 * @param {number} phoneNumber
 */
export declare const newOrder: (orderId: string, phoneNumber: number) => Promise<boolean>;
/**
 * sends sms when order has been shipped
 * @param {sting} orderId
 * @param {number} phoneNumber
 */
export declare const orderShipped: (orderId: string, phoneNumber: number) => Promise<boolean>;
