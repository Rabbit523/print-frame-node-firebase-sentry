import { IUser } from "./user.model";
interface IUserFunctions {
    getOneById(id: string): Promise<IUser | null>;
    getAll(offset: number, limit: number): Promise<IUser[]>;
}
export declare const userFunctions: IUserFunctions;
export {};
