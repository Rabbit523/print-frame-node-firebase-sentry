import { IAddress, IParcel, IShipment } from "./../generalInterfaces";
declare enum addressVerification {
    delivery = "delivery",
    zip4 = "zip4"
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
export declare const createNewAddress: (address: EasyPostAddress) => Promise<any>;
export declare const verifyAddress: (addrr: any) => any;
export declare const createParcel: (parcel: IParcel) => Promise<any>;
export declare const createShipment: (shipment: IShipment) => Promise<any>;
export declare const getRates: (fromAddress: addressObject, toAddress: addressObject, parcel: IParcel) => Promise<any>;
export declare const buyShipment: (rateId: string, shipment: any) => Promise<any>;
export {};
