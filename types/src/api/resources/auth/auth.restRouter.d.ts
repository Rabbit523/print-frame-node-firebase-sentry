import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
    logout: Function;
}
export declare const authRouter: import("express-serve-static-core").Router;
