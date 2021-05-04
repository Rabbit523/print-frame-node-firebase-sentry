export declare const productResolvers: {
    Query: {
        getProduct: (obj: any, args: any, ctx: any, info: any) => Promise<any>;
        getAllProducts: (obj: any, args: any, ctx: any, info: any) => Promise<{
            products: any;
            total: any;
        }>;
    };
    Mutation: {
        createProduct: (obj: any, args: any, ctx: any, info: any) => any;
        updateProduct: (obj: any, args: any, ctx: any, info: any) => Promise<any>;
        deleteProduct: (obj: any, args: any, ctx: any, info: any) => Promise<any>;
    };
};
