import mongoose, { Document } from "mongoose";
export interface IUserMeta extends Document {
    metaKey: string;
    metaValue: string;
    userId: IUser["_id"];
}
export declare const userMeta: mongoose.Model<IUserMeta, {}>;
export interface IUser extends Document {
    userName: string;
    userEmail: [string | boolean];
    password: string;
    userActivationKey?: string;
    googleId?: string;
    fbId?: string;
    authenticate(plainTextPassword: string): boolean;
    hashPassword(plainTextPassword: string): string;
}
export declare const validateEmail: (v: string) => boolean;
export declare const validatePassword: (k: string) => boolean;
export declare const userModel: mongoose.Model<IUser, {}>;
