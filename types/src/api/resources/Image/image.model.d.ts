import mongoose, { Document } from "mongoose";
import { IOrder } from "../order/order.model";
import { IPrintSize } from "../printSize/printSize.model";
import { IPrintAndFrame } from "../printAndFrame/printAndFrame.model";
export interface IImage extends Document {
    orderId: IOrder["_id"];
    printId: IPrintSize["_id"];
    printAndFrameId: IPrintAndFrame["_id"];
    s3key: string;
    quantity: Number;
}
export declare const imageModel: mongoose.Model<IImage, {}>;
