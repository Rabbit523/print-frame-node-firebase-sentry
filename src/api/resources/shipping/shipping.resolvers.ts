import { createNewAddress, createParcel, createShipment } from '../../libraries/easyPost';
import { IAddress, userRoles } from '../../generalInterfaces';
import { authorized, authenticated } from '../auth/auth.resolvers';

const getRates = async (
  source: any,
  { input }: { input: { address: IAddress; parcel: any } },
  { Models: { optionModel } },
) => {
  const masterId = await optionModel.findOne({ optionKey: 'masterEasyPostId' }).exec();
  const toAddress = await createNewAddress(input.address);
  let rates: any = [];
  for (const item of input.parcel) {
    const id = item.id;
    delete item.id;
    const parcel = await createParcel(item);
    const shipment = await createShipment({ from_address: masterId.optionValue, to_address: toAddress.id, parcel });
    rates.push({ rates: shipment.rates, id });
  }

  return rates;
};
const createMasterAddress = async (source: any, { input }: { input: IAddress }, { Models: { optionModel } }) => {
  try {
    const address = await createNewAddress(input);
    await optionModel.create({ optionKey: 'masterEasyPostId', optionValue: address.id });
    return true;
  } catch (e) {
    return false;
  }
};

export const shippingResolvers = {
  Query: {
    getRates: authenticated(getRates),
  },
  Mutation: {
    createMasterAddress: authenticated(authorized(userRoles.admin, createMasterAddress)),
  },
};
