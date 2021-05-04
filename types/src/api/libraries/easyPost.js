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
const api_1 = __importDefault(require("@easypost/api"));
const config_1 = __importDefault(require("./../../config"));
const Sentry = __importStar(require("@sentry/node"));
const api = new api_1.default(config_1.default.secrets.EASYPOST);
var addressVerification;
(function (addressVerification) {
    addressVerification["delivery"] = "delivery";
    addressVerification["zip4"] = "zip4";
})(addressVerification || (addressVerification = {}));
exports.createNewAddress = async (address) => {
    try {
        const val = new api.Address(address);
        const res = await val.save();
        return res;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
exports.verifyAddress = (addrr) => {
    if (addrr.verifications.delivery) {
        return addrr.verifications.delivery.success;
    }
    return false;
};
exports.createParcel = async (parcel) => {
    try {
        const val = new api.Parcel(parcel);
        const res = await val.save();
        return res;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
exports.createShipment = async (shipment) => {
    try {
        const val = new api.Shipment(shipment);
        const res = await val.save();
        return res;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
exports.getRates = async (fromAddress, toAddress, parcel) => {
    // const from = await createNewAddress(fromAddress);
    // const to = await createNewAddress(toAddress);
    const parcelSize = await exports.createParcel(parcel);
    return await exports.createShipment({
        from_address: fromAddress.id,
        to_address: toAddress.id,
        parcel: parcelSize.id,
    });
};
exports.buyShipment = async (rateId, shipment) => {
    try {
        const val = await shipment.buy(rateId);
        Sentry.captureException(JSON.stringify(val, null, 4));
        return val;
    }
    catch (e) {
        Sentry.captureException(e);
    }
};
//sample
// const from = {
//   name: "Hamidfda",
//   street1: "9845 Mira Lee way apt 30106",
//   city: "san diego",
//   state: "ca",
//   country: "usa",
//   zip: "92126",
//   phone: "949-357-4593",
//   verify: [addressVerification.delivery]
// };
// const to = {
//   name: "otherHamid",
//   street1: "68207 verano pl",
//   city: "irvine",
//   state: "ca",
//   country: "usa",
//   zip: "92613",
//   phone: "949-389-7692"
//   // verify: [addressVerification.delivery]
// };
// const parcel = {
//   length: 9,
//   width: 6,
//   height: 2,
//   weight: 10
// };
// getRates(from, to, parcel)
//   .then(shipObject => {
//     Sentry.captureException(JSON.stringify(shipObject, null, 4));
//     buyShipment(shipObject.rates[0].id, shipObject);
//   })
//   .catch(e => {
//     Sentry.captureException("catching");
//     Sentry.captureException(e);
//   });
// try {
//   getRates(from, to, parcel);
// } catch (e) {
//   Sentry.captureException("there is an error");
// }
//# sourceMappingURL=easyPost.js.map