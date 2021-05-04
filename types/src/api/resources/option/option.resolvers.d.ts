import { IOption } from "./option.model";
export declare const optionResolvers: {
    Query: {
        getOption: (obj: any, args: {
            input: IOption;
        }, ctx: any, info: any) => Promise<any>;
        getAllOptions: (obj: any, args: {
            input: {
                offset: number;
                limit: number;
            };
        }, ctx: any, info: any) => Promise<{
            options: any;
            total: any;
        }>;
    };
    Mutation: {
        createOption: (obj: any, args: any, ctx: any, info: any) => Promise<any>;
        updateOption: (obj: any, args: {
            input: IOption;
        }, ctx: any, info: any) => Promise<any>;
        deleteOption: (obj: any, args: {
            input: {
                id: string;
            };
        }, ctx: any, info: any) => Promise<any>;
    };
};
