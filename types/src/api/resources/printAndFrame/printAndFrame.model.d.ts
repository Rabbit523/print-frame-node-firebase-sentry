import mongoose, { Document } from "mongoose";
export interface IPrintAndFrame extends Document {
    frameName: string;
    width: Number;
    height: Number;
    price: Number;
    disabled: boolean;
    frameUrl: string;
    margin: Number;
}
export declare const printAndFrameModel: mongoose.Model<IPrintAndFrame, {}>;
