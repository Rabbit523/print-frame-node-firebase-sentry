export declare const imageResolvers: {
    Query: {};
    Mutation: {
        singleImageFileUpload: (source: any, { input: file }: {
            input: any;
        }, { req, Models: { orderModel, imageModel, optionModel, printSizeModel } }: {
            req: any;
            Models: {
                orderModel: any;
                imageModel: any;
                optionModel: any;
                printSizeModel: any;
            };
        }) => Promise<{
            base64: string;
            printSizes: any;
        }>;
    };
};
