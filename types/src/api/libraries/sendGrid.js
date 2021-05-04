"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = __importDefault(require("../../config"));
const option_model_1 = require("./../resources/option/option.model");
const Sentry = __importStar(require("@sentry/node"));
mail_1.default.setApiKey(config_1.default.secrets.SENDGRID_API_KEY);
/**
 *
 * @param args
 */
exports.sendEmail = async (args) => {
    try {
        const mail = await mail_1.default.send(args);
        return mail;
    }
    catch (e) {
        Sentry.captureException(e);
        return false;
    }
};
//TODO:correct the template id
//TODO: add the right template id and emails in here
const getMasterEmail = async () => {
    try {
        const masterEmail = await option_model_1.optionModel.findOne({ optionKey: 'masterEmail' }).exec();
        if (!masterEmail) {
            Sentry.captureException('Email not Found');
            return new Error();
        }
        else
            return masterEmail.optionValue;
    }
    catch (e) {
        Sentry.captureException('Email not Found');
        return new Error();
    }
};
exports.forgotPassword = ({ userName, userEmail, resetLink }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it Account Recovery',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                userName: userName,
                passwordLink: resetLink,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
exports.newAccountSignUp = ({ firstName, userEmail }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it New Account creation',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                firstName,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
exports.newOrderCreatedClient = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it New Order Created',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
exports.orderShipped = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it New Order Created',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
exports.cancelOrder = ({ firstName, userEmail, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it New Order Created',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                firstName,
                orderId,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
exports.contactFormSubmission = async ({ name, email, category, message }) => {
    try {
        const masterEmail = await getMasterEmail();
        const params = {
            personalizations: [
                {
                    to: [
                        {
                            email: masterEmail,
                        },
                    ],
                    subject: 'Print and Frame it New Contact Form Submission',
                },
            ],
            reply_to: email,
            from: {
                email: masterEmail,
                name: 'printAndFrameIt Website',
            },
            dynamic_template_data: {
                name,
                email,
                category,
                message,
            },
            tracking_settings: {
                click_tracking: {
                    enable: true,
                },
                open_tracking: {
                    enable: true,
                },
            },
            footer: {
                enable: false,
            },
            template_id: 'd-b73745243c324648bd7667f29f7aee73',
        };
        exports.sendEmail(params);
    }
    catch (e) {
        Sentry.captureException('master email not defined');
    }
};
exports.newOrderCreatedAdmin = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail,
                    },
                ],
                subject: 'Print and Frame it New Order Created',
            },
        ],
        from: {
            email: 'info@printandframeit.com',
            name: 'printAndFrameIt',
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId,
            },
        },
        tracking_settings: {
            click_tracking: {
                enable: true,
            },
            open_tracking: {
                enable: true,
            },
        },
        footer: {
            enable: false,
        },
        template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
    };
    exports.sendEmail(params);
};
//# sourceMappingURL=sendGrid.js.map