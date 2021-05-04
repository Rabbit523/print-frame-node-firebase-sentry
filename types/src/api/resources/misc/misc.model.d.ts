import { Document } from "mongoose";
export interface IOption extends Document {
    optionKey: string;
    optionValue: string;
}
export declare const miscModel: {};
