import Easypost from '@easypost/api';
import config from './../../config';
import { IAddress, IParcel, IShipment } from './../generalInterfaces';
import * as Sentry from '@sentry/node';

const api = new Easypost(config.secrets.EASYPOST);
enum addressVerification {
  delivery = 'delivery',
  zip4 = 'zip4',
}
interface EasyPostAddress extends IAddress {
  verify?: addressVerification[];
}
interface addressObject extends IAddress {
  id: string;
  object: string;
  mode: string;
  verifications: any;
}
export const createNewAddress = async (address: EasyPostAddress) => {
  try {
    const val = new api.Address(address);
    const res = await val.save();
    return res;
  } catch (e) {
    Sentry.captureException(e);
  }
};

export const verifyAddress = (addrr: any) => {
  if (addrr.verifications.delivery) {
    return addrr.verifications.delivery.success;
  }
  return false;
};
export const createParcel = async (parcel: IParcel) => {
  try {
    const val = new api.Parcel(parcel);
    const res = await val.save();
    return res;
  } catch (e) {
    Sentry.captureException(e);
  }
};

export const createShipment = async (shipment: IShipment) => {
  try {
    const val = new api.Shipment(shipment);
    const res = await val.save();
    return res;
  } catch (e) {
    Sentry.captureException(e);
  }
};

export const getRates = async (fromAddress: addressObject, toAddress: addressObject, parcel: IParcel) => {
  // const from = await createNewAddress(fromAddress);
  // const to = await createNewAddress(toAddress);
  const parcelSize = await createParcel(parcel);
  return await createShipment({
    from_address: fromAddress.id,
    to_address: toAddress.id,
    parcel: parcelSize.id,
  });
};

export const buyShipment = async (rateId: string, shipment) => {
  try {
    const val = await shipment.buy(rateId);
    Sentry.captureException(JSON.stringify(val, null, 4));
    return val;
  } catch (e) {
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
