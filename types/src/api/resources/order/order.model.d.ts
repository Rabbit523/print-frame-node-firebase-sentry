import mongoose, { Document } from "mongoose";
import { IUser } from "../user/user.model";
import { IAddress, orderStatus } from "../../generalInterfaces";
export interface IOrder extends Document {
    userID: IUser["_id"];
    paymentDate: Date;
    shipmentDate: Date;
    orderStatue: orderStatus;
    billingAddress: IAddress;
    shippingAddress: IAddress;
    total: number;
    orderId: number;
}
export declare const orderModel: mongoose.Model<IOrder, {}>;
