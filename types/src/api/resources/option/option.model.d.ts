import mongoose, { Document } from "mongoose";
export interface IOption extends Document {
    optionKey: string;
    optionValue: string;
}
export declare const optionModel: mongoose.Model<IOption, {}>;
