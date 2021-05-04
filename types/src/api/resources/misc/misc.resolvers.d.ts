import { IContactForm } from "./../../libraries/sendGrid";
export declare const miscResolvers: {
    Mutation: {
        sendContactForm: (source: any, { input }: {
            input: IContactForm;
        }, ctx: any) => Promise<boolean>;
    };
};
