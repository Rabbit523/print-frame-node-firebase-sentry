"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@easypost/api");
const config_1 = require("./../../config");
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
        console.log(e);
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
        console.log(e);
    }
};
exports.createShipment = async (shipment) => {
    try {
        const val = new api.Shipment(shipment);
        const res = await val.save();
        return res;
    }
    catch (e) {
        console.log(e);
    }
};
exports.getRates = async (fromAddress, toAddress, parcel) => {
    // const from = await createNewAddress(fromAddress);
    // const to = await createNewAddress(toAddress);
    const parcelSize = await exports.createParcel(parcel);
    return await exports.createShipment({
        from_address: fromAddress.id,
        to_address: toAddress.id,
        parcel: parcelSize.id
    });
};
exports.buyShipment = async (rateId, shipment) => {
    try {
        const val = await shipment.buy(rateId);
        // console.log(JSON.stringify(val, null, 4));
        return val;
    }
    catch (e) {
        console.log(e);
    }
};
//sample
const from = {
    name: "Hamidfda",
    street1: "9845 Mira Lee way apt 30106",
    city: "san diego",
    state: "ca",
    country: "usa",
    zip: "92126",
    phone: "949-357-4593",
    verify: [addressVerification.delivery]
};
const to = {
    name: "otherHamid",
    street1: "68207 verano pl",
    city: "irvine",
    state: "ca",
    country: "usa",
    zip: "92613",
    phone: "949-389-7692"
    // verify: [addressVerification.delivery]
};
const parcel = {
    length: 9,
    width: 6,
    height: 2,
    weight: 10
};
// getRates(from, to, parcel)
//   .then(shipObject => {
//     // console.log(JSON.stringify(shipObject, null, 4));
//     buyShipment(shipObject.rates[0].id, shipObject);
//   })
//   .catch(e => {
//     console.log("catching");
//     console.log(e);
//   });
// try {
//   getRates(from, to, parcel);
// } catch (e) {
//   console.log("there is an error");
// }
//# sourceMappingURL=easyPost.js.map