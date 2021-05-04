/// <reference types="request" />
/**
 *
 * @param args
 */
export declare const sendEmail: (args: any) => Promise<[import("request").Response, {}] | undefined>;
export interface IContactForm {
    name: string;
    email: string;
    category: string;
    message: string;
}
interface IForgotPass {
    userName: string;
    userEmail: string;
    resetLink: string;
}
interface INewAccount {
    firstName: string;
    userEmail: string;
}
interface INewOrder {
    firstName: string;
    userEmail: string;
    invoiceUrl: string;
    orderId: string;
}
export declare const forgotPassword: ({ userName, userEmail, resetLink }: IForgotPass) => void;
export declare const newAccountSignUp: ({ firstName, userEmail }: INewAccount) => void;
export declare const newOrderCreatedClient: ({ firstName, userEmail, invoiceUrl, orderId }: INewOrder) => void;
export declare const orderShipped: ({ firstName, userEmail, invoiceUrl, orderId }: INewOrder) => void;
interface ICancelOrder {
    firstName: string;
    userEmail: string;
    orderId: string;
}
export declare const cancelOrder: ({ firstName, userEmail, orderId }: ICancelOrder) => void;
export declare const contactFormSubmission: ({ name, email, category, message }: IContactForm) => void;
export declare const newOrderCreatedAdmin: ({ firstName, userEmail, invoiceUrl, orderId }: INewOrder) => void;
export {};
