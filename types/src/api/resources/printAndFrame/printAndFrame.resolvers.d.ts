interface IPrintFrame {
    frameName: string;
    width: Number;
    height: Number;
    price: Number;
    disabled: boolean;
    frameUrl: string;
    margin: Number;
    id?: string;
}
export declare const printAndFrameResolvers: {
    Query: {
        getAllPrintFrames: (source: any, args: {
            input: {
                offset: number;
                limit: number;
            };
        }, ctx: any) => Promise<{
            printFrames: any;
            total: any;
        }>;
        getOnePrintFrame: (obj: any, { input: { id } }: {
            input: {
                id: string;
            };
        }, ctx: any) => Promise<any>;
    };
    Mutation: {
        createPrintFrame: (obj: any, { input }: {
            input: IPrintFrame;
        }, ctx: any) => Promise<any>;
        updatePrintFrame: (obj: any, { input }: {
            input: IPrintFrame;
        }, ctx: any) => Promise<any>;
        deletePrintFrame: (obj: any, { input: { id } }: {
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
