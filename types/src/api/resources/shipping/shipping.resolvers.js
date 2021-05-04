"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easyPost_1 = require("../../libraries/easyPost");
const generalInterfaces_1 = require("../../generalInterfaces");
const auth_resolvers_1 = require("../auth/auth.resolvers");
const getRates = async (source, { input }, { Models: { optionModel } }) => {
    const masterId = await optionModel.findOne({ optionKey: 'masterEasyPostId' }).exec();
    const toAddress = await easyPost_1.createNewAddress(input.address);
    let rates = [];
    for (const item of input.parcel) {
        const id = item.id;
        delete item.id;
        const parcel = await easyPost_1.createParcel(item);
        const shipment = await easyPost_1.createShipment({ from_address: masterId.optionValue, to_address: toAddress.id, parcel });
        rates.push({ rates: shipment.rates, id });
    }
    return rates;
};
const createMasterAddress = async (source, { input }, { Models: { optionModel } }) => {
    try {
        const address = await easyPost_1.createNewAddress(input);
        await optionModel.create({ optionKey: 'masterEasyPostId', optionValue: address.id });
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.shippingResolvers = {
    Query: {
        getRates: auth_resolvers_1.authenticated(getRates),
    },
    Mutation: {
        createMasterAddress: auth_resolvers_1.authenticated(auth_resolvers_1.authorized(generalInterfaces_1.userRoles.admin, createMasterAddress)),
    },
};
//# sourceMappingURL=shipping.resolvers.js.map