import mongoose, { Document } from "mongoose";
declare enum fixOrPercent {
    fix = "fix",
    percent = "percent"
}
export interface IDiscountCode extends Document {
    code: string;
    expirationDate?: Date;
    value: number;
    type: fixOrPercent;
    limit?: number;
    timesUsed?: number;
}
export declare const discountCodeModel: mongoose.Model<IDiscountCode, {}>;
export {};
