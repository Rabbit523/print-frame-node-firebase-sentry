interface IPrintSize {
    width: Number;
    height: Number;
    price: Number;
    widthHeight: Number;
    id?: string;
}
export declare const printSizeResolvers: {
    Query: {
        getAllPrintSizes: (source: any, args: {
            input: {
                offset: number;
                limit: number;
            };
        }, ctx: any) => Promise<{
            printSizes: any;
            total: any;
        }>;
        getOnePrintSize: (obj: any, { input: { id } }: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<any>;
    };
    Mutation: {
        createPrintSize: (obj: any, { input }: {
            input: IPrintSize;
        }, ctx: any) => Promise<any>;
        updatePrintSize: (obj: any, { input }: {
            input: IPrintSize;
        }, ctx: any) => Promise<any>;
        deletePrintSize: (obj: any, { input: { id } }: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<{
            id: string;
            err: number;
        }>;
    };
};
export {};
