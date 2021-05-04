/// <reference types="mongoose" />
import { ApolloServer } from "apollo-server-express";
import "./libraries/pdfGenerator";
export declare const structure: {
    typeDefs: string;
    resolvers: any;
};
export declare const Models: {
    userModel: import("mongoose").Model<import("./resources/user/user.model").IUser, {}>;
    userMeta: import("mongoose").Model<import("./resources/user/user.model").IUserMeta, {}>;
    authModel: import("mongoose").Model<import("./resources/auth").IAuth, {}>;
    optionModel: import("mongoose").Model<import("./resources/option/option.model").IOption, {}>;
    orderModel: import("mongoose").Model<import("./resources/order/order.model").IOrder, {}>;
    imageModel: import("mongoose").Model<import("./resources/Image/image.model").IImage, {}>;
    productModel: import("mongoose").Model<import("mongoose").Document, {}>;
    printAndFrameModel: import("mongoose").Model<import("./resources/printAndFrame/printAndFrame.model").IPrintAndFrame, {}>;
    printSizeModel: import("mongoose").Model<import("./resources/printSize/printSize.model").IPrintSize, {}>;
    discountCodeModel: import("mongoose").Model<import("./resources/discountCode/discountCode.model").IDiscountCode, {}>;
};
export declare const graphQLServer: ApolloServer;
