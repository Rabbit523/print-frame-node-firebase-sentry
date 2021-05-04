import mongoose, { Document } from "mongoose";
export interface IPrintSize extends Document {
    width: Number;
    height: Number;
    widthHeight: Number;
    price: Number;
    disabled: boolean;
}
export declare const printSizeModel: mongoose.Model<IPrintSize, {}>;
