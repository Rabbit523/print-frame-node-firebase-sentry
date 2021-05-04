export declare const authResolvers: {
    Query: {
        forgotLogin: (obj: any, args: {
            input: {
                username: string;
            };
        }, ctx: any) => Promise<void>;
    };
    Mutation: {
        recoverPassword: (obj: any, args: {
            input: {
                hash: string;
                userId: string;
                newPassword: string;
            };
        }, ctx: any, info: any) => Promise<boolean>;
    };
};
