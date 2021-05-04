import { IDiscountCode } from "./discountCode.model";
export declare const discountCodeResolvers: {
    Query: {
        getAllDiscountCodes: (source: any, args: {
            input: {
                offset: number;
                limit: number;
            };
        }, ctx: any) => Promise<{
            discountCodes: any;
            total: any;
        }>;
        getOneDiscountCode: (obj: any, { input: { id } }: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<any>;
        isValidDiscountCode: (source: any, { input: { code } }: {
            input: {
                code: string;
            };
        }, ctx: any) => Promise<"" | {
            value: any;
            type: any;
        }>;
    };
    Mutation: {
        createDiscountCode: (obj: any, { input }: {
            input: IDiscountCode;
        }, ctx: any) => Promise<any>;
        updateDiscountCode: (obj: any, { input }: {
            input: IDiscountCode;
        }, ctx: any) => Promise<any>;
        deleteDiscountCode: (obj: any, { input: { id } }: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<{
            id: string;
            err: number;
        }>;
    };
};
