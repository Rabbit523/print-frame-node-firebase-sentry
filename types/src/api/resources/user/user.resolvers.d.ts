import { IUser } from "./user.model";
export declare const userResolvers: {
    Query: {
        getUser: (obj: any, args: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<IUser>;
        getAllUsers: (obj: any, args: {
            input: {
                offset: number;
                limit: number;
            };
        }, ctx: any) => Promise<{
            users: any;
            total: any;
        }>;
        isUser: (obj: any, args: {
            input: {
                userName: string;
            };
        }, ctx: any) => Promise<boolean>;
    };
    Mutation: {
        createUser: (obj: any, args: {
            input: IUser;
        }, ctx: any) => Promise<any>;
        updateUser: (obj: any, { input }: {
            input: IUser;
        }, ctx: any) => Promise<any>;
        deleteUser: (obj: any, args: {
            input: {
                id: string;
            };
        }, ctx: any, info: string) => Promise<any>;
    };
};
