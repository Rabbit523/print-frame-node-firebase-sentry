import mongoose, { Document } from "mongoose";
import { IUser } from "../user/user.model";
export interface IAuth extends Document {
    userId: IUser["_id"];
    state: string;
    Token: string;
    expires: string;
}
export declare const authModel: mongoose.Model<IAuth, {}>;
