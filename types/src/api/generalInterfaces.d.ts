export interface IContext {
}
export declare enum orderStatus {
    started = "started",
    completed = "completed",
    cancelled = "cancelled",
    refunded = "refunded",
    paymentFailed = "paymentFailed",
    pendingShipment = "pendingShipment"
}
export declare const statesArray: string[];
export interface IAddress {
    name: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone?: string;
    email?: string;
}
export interface IParcel {
    length: number;
    width: number;
    height: number;
    weight: number;
}
export interface IShipment {
    to_address: string;
    from_address: string;
    parcel: string;
}
export interface IAcceptPaymentConfig {
    token: string;
    invoiceNumber: string;
    generalProductDescription: string;
    taxAmount: number;
    taxName: string;
    taxDescription: string;
    shippingAmount: number;
    shippingService: string;
    shippingDescription?: string;
    billingAddress: IAddress;
    shippingAddress: IAddress;
    customerMessage?: string;
    items: [IItem];
    total: number;
    email: string;
}
export interface IItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
}
